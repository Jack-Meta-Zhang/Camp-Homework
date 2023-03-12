require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const SEPOLIA_RPC_RUL = process.env.SEPOLIA_RPC_RUL;
module.exports = {
  solidity: "0.8.18",
  networks:{
    goerli:{
      url:GOERLI_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId:5
    },
    sepolia:{
      url:SEPOLIA_RPC_RUL,
      accounts:[PRIVATE_KEY],
      chainId:11155111
    },
    mumbai:{
      url:MUMBAI_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId:80001
    },
    localhost:{
      url:"http://127.0.0.0:8545",
      chainId:31337
    }
  },
  etherscan:{
    apiKey:POLYGONSCAN_API_KEY
  },
  // polygonscan:{
  //   apiKey:POLYGONSCAN_API_KEY
  // }
};
