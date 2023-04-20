require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const SEPOLIA_RPC_RUL = process.env.SEPOLIA_RPC_RUL;
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.18" },
      {
        version: "0.5.16",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.5.0",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.8.7",
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      gas: 12000000,
    },
    hardhat: {
      forking: {
        url: MAINNET_RPC_URL,
      },
      chainId: 31337,
      gas: 12000000,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
    sepolia: {
      url: SEPOLIA_RPC_RUL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
};
