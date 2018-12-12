const HDWalletProvider = require('truffle-hdwallet-provider'); 
const Web3 = require('web3');
const compiledContracts = require('./compile');
const dotenv = require('dotenv');
const path = require('path'); 
const fs = require('fs');

dotenv.load();

const provider = new HDWalletProvider(  
  process.env.META_MASK_MNEMONIC, 
  process.env.CHAIN_LINK
);

const web3 = new Web3(provider);

const deploy = async () => {
    accounts = await web3.eth.getAccounts(); 
    console.log('attempting to deploy from account',accounts[0]);

    let deployInfo = [];

    for (const contract of compiledContracts) {
      const { name, abi, bytecode } = contract;
            
      //console.log(bytecode);
      //console.log(abi);

      const result = await new web3.eth.Contract(abi)
        .deploy({data: '0x' + bytecode})
        .send({from: accounts[0], gas: '5000000'});

      deployInfo.push({name, address: result.options.address, publishedBy: accounts[0], abi});
      
      console.log(`Contract: ${name} deployed to`, result.options.address); 
    }     
    
    return deployInfo;
};

const writeToFile = (object) => {
  const filePath = path.resolve(process.env.DEPLOYMENT_INFO_PATH);
  const fileName = "contracts.js";

  fs.writeFileSync(`${filePath}/${fileName}`, `export default ${JSON.stringify(object)};`, {encoding: 'utf-8'});
}

const main = async () => {
  const deployInfo = await deploy();
  writeToFile(deployInfo);

  console.log("knackig");
  process.exit(0);
}
  
main();
