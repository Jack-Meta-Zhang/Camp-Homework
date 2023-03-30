<template>
  <div v-show="!isConnected">
    <button @click="connectWallet">连接钱包</button>
  </div>
    <div v-show="isConnected">
        <div>
        <br /> 当前用户 : {{ currAddress  }}
        <br>
        <br /> Token名称 : {{ name  }}
        <br /> Token符号 : {{  symbol }}
        <br /> Token精度 : {{  decimal }}
        <br /> Token发行量 : {{  supply }}
        <br /> 我的Token余额 : {{ balance  }}
        <br /> 我的ETH余额 : {{ ethbalance  }}
        <br>
        <br /> 我的金库余额 : {{ bankBalance  }} wei
        <br />
        <input type="text" v-model="withdrawAmount" />
        <button @click="withdraw">取钱</button>
      </div>

      <div >
        <br />转账到:
        <input type="text" v-model="recipient" />
        <br />转账金额
        <input type="text" v-model="amount" />
        <br />
        <button @click="transfer()"> 转账 </button>
      </div>
      <br>
      <br>

    <div >
      <input v-model="stakeAmount" placeholder="输入质押量"/>
      <button @click="permitDeposit">离线授权存款</button>
    </div>
    <br>
    <br>
    <div >
      <input v-model="approveAmount" placeholder="授权数量"/>
      <button @click="approveDeposit">授权存款</button>
      <input v-model="depositAmount" placeholder="存入金库数量"/>
      <button @click="deposit">存入金库</button>
    </div>
    </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';

import { ethers } from 'ethers'
import erc2612Addr from '../../deployments/address/ERC2612.json'
import bankAddr from '../../deployments/address/Vault.json'

import erc2612Abi from '../../deployments/abi/ERC2612-abi.json'
import bankAbi from '../../deployments/abi/Vault-abi.json'
// import { premitTypedDate } from "../typedData.js";

    let currAddress = ref(null)
    let name = ref('')
    let recipient = ref(null)
    let amount=ref(null)
    let balance=ref(0)
    let ethbalance=ref(0)
    let decimal=ref(0)
    let symbol=ref('')
    let supply=ref(0)
    let stakeAmount=ref()

    let isConnected = ref(false)

    let bankBalance = ref(0)
    let approveAmount = ref()
    let depositAmount = ref()

    let withdrawAmount = ref()

    // let token = reactive({
    //     name :'',
    //     recipient:null,
    //     amount:0,
    //     balance:0,
    //     ethbalance:0,
    //     decimal:0,
    //     symbol:0,
    //     supply:0,
    //     stakeAmount:0
    // })

    let erc20Token,bank,provider,signer,account,chainId

    onMounted(async()=>{
      //  await initAccount();
      //  initContract()
      //  getInfo()
       window.ethereum.on('accountsChanged', handleAccountsChanged);
    })
    //切换钱包或者断开连接
    const handleAccountsChanged = async(accounts)=>{
      
        if(accounts.length > 0){
          // await initAccount();
          // initContract()
          // getInfo()
          await connectWallet()
        }else{
          isConnected.value = false
        }
    }

    const connectWallet = async()=>{
      await initAccount()
        initContract()
        getInfo()
    }

    //连接钱包
    const initAccount = async()=>{
        console.log("initAccount");
        if(window.ethereum){
            try {
                provider = new ethers.providers.Web3Provider(window.ethereum)
                let accounts = await provider.send("eth_requestAccounts", []);
                signer =  provider.getSigner()
                account = accounts[0]
                currAddress.value = account.slice(0,6) + "...." + account.slice(account.length - 6)
                let network = await provider.getNetwork()
                chainId = network.chainId;
                isConnected.value = true
            } catch (error) {
                console.log("User denied account access", error)
            }

        }else{
            console.log("Need install MetaMask")
        }
    }
    //连接合约
    const initContract = ()=>{
      console.log(signer,11,account)
        erc20Token = new ethers.Contract(erc2612Addr.address, 
        erc2612Abi, signer);

        bank = new ethers.Contract(bankAddr.address, 
            bankAbi, signer);
    }
    //读取合约信息
    const getInfo =()=> {
      provider.getBalance(account).then((r) => {
        ethbalance.value = ethers.utils.formatEther(r);
      });
      erc20Token.name().then((r) => {
        name.value = r;
      })

      erc20Token.decimals().then((r) => {
        decimal.value = r;
      })
      erc20Token.symbol().then((r) => {
        symbol.value = r;
      })
      erc20Token.totalSupply().then((r) => {
        supply.value = ethers.utils.formatUnits(r, 18);
      })
      erc20Token.balanceOf(account).then((r) => {
        balance.value = ethers.utils.formatUnits(r, 18);
      })

      bank.addressToAmount(account).then(r=>{
        bankBalance.value = ethers.utils.formatEther(r)
      })
      
    }



    //转token  0x9F46dA28D5096641F88266BdAeF5ADb66118E119
    const transfer = ()=>{
        if(recipient.value && amount.value){
            // let tokenSigner = erc20Token.connect(signer)
            erc20Token.transfer(recipient.value,ethers.utils.parseEther(amount.value))
                .then(async(r)=>{
                    await r.wait(1)
                    getInfo();
                    amount.value = 0
                })
        }else{
            console.log("请输入要转账的账号和金额")
        }

    }

    //授权
    const approveDeposit = ()=>{
      erc20Token.approve(bank.address,ethers.utils.parseEther(approveAmount.value)).then(r=>{
        console.log('approve success')
        approveAmount.value = ''
      })
    }
    //存款
    const deposit = ()=>{
      bank.deposit(ethers.utils.parseEther(depositAmount.value)).then(async(r)=>{
        await r.wait(1)
        getInfo();
        console.log('deposit success')
        depositAmount.value = ''
      })
    }
    //取款
    const withdraw = ()=>{
      bank.withdraw(ethers.utils.parseEther(withdrawAmount.value)).then(async(r)=>{
        await r.wait(1)
        getInfo();
        console.log('withdraw success')
        withdrawAmount.value = ''
      })
    }

    // let getNonce = async()=>{
    //     let nonce = await erc20Token.nonces(account)
    //     console.log("nonce:"+nonce)
    //     return nonce.toString();
    // }


    //permit转Token
    let permitDeposit = async()=> {
    //   let nonce = await getNonce();
      let nonce = await erc20Token.nonces(account)
      let deadline = Math.ceil(Date.now() / 1000) + parseInt(20 * 60);
      let sendAmount =  ethers.utils.parseUnits(stakeAmount.value);
      console.log(sendAmount)
      
      const domain = {
          name: 'ERC2612',
          version: '1',
          chainId: chainId,
          verifyingContract: erc2612Addr.address
      }
      const types = {
          Permit: [
            {name: "owner", type: "address"},
            {name: "spender", type: "address"},
            {name: "value", type: "uint256"},
            {name: "nonce", type: "uint256"},
            {name: "deadline", type: "uint256"}
          ]
      };
      const message = {
          owner: account,
          spender: bankAddr.address,
          value: sendAmount,
          nonce: nonce,
          deadline: deadline
      };
      console.log(message)
      const signature = await signer._signTypedData(domain, types, message);
      console.log("signature:" + signature)
      const {v, r, s} = ethers.utils.splitSignature(signature);
      // bank.permitDeposit(account, sendAmount, deadline, v, r, s, {
      //         from: account
      //       }).then(() => {
      //         getInfo();
      //         getNonce();
      //     })

      //前端实现permitDeposit
      await erc20Token.permit(
        account,
        bank.address,
        sendAmount,
        deadline,
        v,
        r,
        s
      )
      bank.deposit(sendAmount).then(async(r)=>{
        await r.wait(1)
        getInfo()

      })
    }



</script>

<style lang="scss" scoped>

</style>

