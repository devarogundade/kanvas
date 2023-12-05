const HDWalletProvider = require('@truffle/hdwallet-provider');

const dotenv = require("dotenv")
dotenv.config()

const MNEMONIC = process.env.MNEMONIC;

module.exports = {
  plugins: [
    'truffle-plugin-stdjsonin'
  ],

  networks: {
    fuji: {
      provider: () => new HDWalletProvider(MNEMONIC, 'https://ava-testnet.public.blastapi.io/ext/bc/C/rpc'),
      network_id: 43113,
      confirmations: 2,
      timeoutBlocks: 9999999,
      skipDryRun: false,
      networkCheckTimeout: 999999999
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.19", // Fetch exact version from solc-bin (default: truffle's version)
      settings: { // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          // enabled: true,
          // runs: 200
        },
        // viaIR: true,
        // evmVersion: "byzantium"
      }
    }
  }
};