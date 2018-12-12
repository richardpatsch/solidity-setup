const path = require('path'); 
const fs = require('fs');
const solc = require('solc');

const contractsFolder = path.resolve(__dirname, 'contracts');
const contractFiles = fs.readdirSync(contractsFolder);

let compiledContracts = [];

console.log(contractFiles);

contractFiles.forEach(contract => {
  if (contract.startsWith('_')) {
    return;
  }
  console.log(contract);
  const source = fs.readFileSync(`${contractsFolder}/${contract}`, 'utf8');
  const name = contract.substr(0, contract.length-4);
  console.log(name + "...");

  const input = {
    language: 'Solidity',
    sources: {
      contract: {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': [ '*' ]
        }
      }
    }
  }
  
  const output = JSON.parse(solc.compile(JSON.stringify(input)))

  //console.log(name + ': ' + JSON.stringify(output.contracts.contract[name].evm));


  //const result = solc.compile(JSON.stringify(input));
  //console.log(output.contracts.contract.Project.abi);

  compiledContracts.push({
    //...output.contracts.contract[name].interface, 
    name, 
    bytecode: output.contracts.contract[name].evm.bytecode.object,
    abi: output.contracts.contract.Project.abi,
  });
})

module.exports = compiledContracts;