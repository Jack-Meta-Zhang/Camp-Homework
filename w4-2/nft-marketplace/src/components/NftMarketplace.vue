<template>
    <div v-show="!state.isConnected">
      <button @click="connectWallet">连接钱包</button>
    </div>
      <div v-show="state.isConnected">
          <div>
          <br /> 当前用户 : {{ state.currAddress  }}
          <br>
          <br /> NFT名称 : {{ nft.name  }}
          <br /> NFT符号 : {{  nft.symbol }}
          <br /> 发行量 : {{  nft.totalCount }} 个
          <br>
          <br /> 我拥有 : {{  nft.myCount }} 个
          <div>
            <!-- <ul>
              <li v-for="(item,index) in state.users" :key="item.id">
              tokenId:{{ item.tokenId }}
              <input type="number" placeholder="售价（单位 ETH）" v-model="item.sellPrice">
              <button @click="listNft(item.id)">上架交易所</button>
              </li>
            </ul> -->
            <input type="number" placeholder="tokenId" v-model="state.sellTokenId">
              <button @click="listNft()">上架交易所</button>
              <input type="number" placeholder="售价（单位 ETH）" v-model="state.sellPrice">
          </div>
          <br>
          <br>
          <div>
            交易所还有   {{ nftMarket.totalNumber }} 个
            <ul>
              <li v-for="(item,index) in nftMarket.listedNfts" :key="item.tokenId">
                tokenId:{{ item.tokenId }}   售价 {{ ethers.utils.formatEther(item.amount) }}  
              <button style="margin: 10px;" @click="buyNft(item.tokenId)">购买</button>
              <span  v-show="item.seller == state.userAddress" >√(已拥有)</span>
              </li>
            </ul>
          </div>
        </div>
        <br>
        <br>
      </div>
  
  </template>
  
  <script setup>
  import { onMounted, reactive ,inject} from 'vue';
  
  import { ethers } from 'ethers'
  import nftMarketplaceAddr from '../../deployments/address/NftMarketplace.json'
  import nftAddr from '../../deployments/address/FeiNft.json'
  
  import nftMarketplaceAbi from '../../deployments/abi/NftMarketplace-abi.json'
  import nftAbi from '../../deployments/abi/FeiNft-abi.json'

  import {GetUsersGql,getActiveItemGql} from '../constants/graphQuery'
  import { useQuery ,provideApolloClient,useApolloClient } from '@vue/apollo-composable'
 
  
      let state = reactive({
        currAddress:'',
        userAddress:'',
        isConnected:false,
        users:[],
        sellPrice:'',
        sellTokenId:''
      })
      let nft = reactive({
          name :'',
          symbol:0,
          totalCount:0,
          myCount:0
      })

      let nftMarket = reactive({
        totalNumber:0,
        listedNfts:[]
      })
  
      let nftMarketplace,feiNft,provider,signer,account,chainId,apolloClients,
      userResult,activeResult
  
      onMounted(async()=>{
         window.ethereum.on('accountsChanged', handleAccountsChanged);
        apolloClients = inject('apolloClients')
         //initUser()
         initActive()
      })

      // const initUser=()=>{
      //   const { result:userResult2} = useQuery(GetUsersGql ,null,
      //   { client: apolloClients.api1  })
      //   userResult = userResult2
      //   console.log(userResult,2234)
      // }
      const initActive=()=>{
        const { result:activeResult2} = useQuery(getActiveItemGql)
        activeResult = activeResult2
        console.log(activeResult,223)
      }

      //获取thegraph  actives数据
      const getActiveData =()=>{
        let activeData = activeResult.value?.activeItems
        nftMarket.listedNfts = activeData?.filter(x=>x.amount>0)
        nftMarket.totalNumber = nftMarket.listedNfts.length
        console.log(activeData,'listedNfts')
      }


      //获取thegraph  users数据
      const getUserData =()=>{
        let usersData = userResult.value?.users.filter(x=>x.address ==state.userAddress)
        //添加售价字段
         //console.log(usersData,11,userResult.value)
        state.users = usersData.map(user => {
          return {
            ...user, // 复制原来的对象
            sellPrice: 10 // 添加 age 字段
          }
        })
      }
      //切换钱包或者断开连接
      const handleAccountsChanged = async(accounts)=>{
          if(accounts.length > 0){
            await connectWallet()
          }else{
            isConnected.value = false
          }
      }
  
      const connectWallet = async()=>{
          await initAccount()
          initContract()
          getInfo()
          //getUserData()
          getActiveData()
          // console.log(1,state.users,2)
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
                  state.userAddress = account
                  state.currAddress = account.slice(0,6) + "...." + account.slice(account.length - 6)
                  let network = await provider.getNetwork()
                  chainId = network.chainId;
                  state.isConnected = true
              } catch (error) {
                  console.log("User denied account access", error)
              }
  
          }else{
              console.log("Need install MetaMask")
          }
      }
      //连接合约
      const initContract = ()=>{
        feiNft = new ethers.Contract(nftAddr.address, 
        nftAbi, signer);
  
        nftMarketplace = new ethers.Contract(nftMarketplaceAddr.address, 
        nftMarketplaceAbi, signer);
      }
      //读取合约信息
      const getInfo =()=> {
        feiNft.name().then((r) => {
          nft.name = r;
        })
  
        feiNft.symbol().then((r) => {
          nft.symbol = r;
        })
        feiNft.getCount().then(r=>{
          nft.totalCount = r;
        })
        feiNft.balanceOf(account).then(r=>{
          nft.myCount = r;
        })
      }
      
      const listNft = async ()=>{
        if(state.sellPrice <= 0 || state.sellTokenId < 0){
          console.log('invalid price')
          return
        }
        // let token = state.users.find(x=>x.id == id)
        //授权
        let tx = await feiNft.approve(nftMarketplace.address,state.sellTokenId)
        await tx.wait(1)
        nftMarketplace.listNft(state.sellTokenId,ethers.utils.parseEther(state.sellPrice.toString(  ))).then(async(r)=>{
            await r.wait(1)
            state.sellPrice = ''
            state.sellTokenId = ''
            getInfo()
            //getUserData()
            getActiveData()
        })
      }
      const buyNft = async(id)=>{
        let nftObj = nftMarket.listedNfts.find(x=>x.tokenId == id)
        nftMarketplace.buyNft(id,nftObj.amount).then(async(r)=>{
          await r.wait(1)
          getInfo()
          getActiveData()
        })
        
      }
  
  
      //转token  0x9F46dA28D5096641F88266BdAeF5ADb66118E119
      // const transfer = ()=>{
      //     if(recipient.value && amount.value){
      //         // let tokenSigner = erc20Token.connect(signer)
      //         erc20Token.transfer(recipient.value,ethers.utils.parseEther(amount.value))
      //             .then(async(r)=>{
      //                 await r.wait(1)
      //                 getInfo();
      //                 amount.value = 0
      //             })
      //     }else{
      //         console.log("请输入要转账的账号和金额")
      //     }
  
      // }
  
      // //授权
      // const approveDeposit = ()=>{
      //   erc20Token.approve(bank.address,ethers.utils.parseEther(approveAmount.value)).then(r=>{
      //     console.log('approve success')
      //     approveAmount.value = ''
      //   })
      // }
      // //存款
      // const deposit = ()=>{
      //   bank.deposit(ethers.utils.parseEther(depositAmount.value)).then(async(r)=>{
      //     await r.wait(1)
      //     getInfo();
      //     console.log('deposit success')
      //     depositAmount.value = ''
      //   })
      // }
      // //取款
      // const withdraw = ()=>{
      //   bank.withdraw(ethers.utils.parseEther(withdrawAmount.value)).then(async(r)=>{
      //     await r.wait(1)
      //     getInfo();
      //     console.log('withdraw success')
      //     withdrawAmount.value = ''
      //   })
      // }
  
  
  
  
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  
  