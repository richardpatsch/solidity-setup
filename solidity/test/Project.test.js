const assert = require('assert'); 
const ganache = require('ganache-cli'); 
const Web3 = require('web3');
const dotenv = require('dotenv');

dotenv.load();

const web3 = new Web3(ganache.provider());

const contracts = require('../compile'); 
const projectContract = contracts.find(contract => contract.name == 'Project');

const { bytecode, abi, name } = projectContract;
dotenv.load();

let accounts;
let project;


beforeEach(async () => {    
    accounts = await web3.eth.getAccounts();    
    //console.log(accounts);
    project = await new web3.eth.Contract(abi)
      .deploy({data: '0x' + bytecode})
      .send({from: accounts[1], gas: '5000000'});               
});

describe('Project',() => {
    it('deploys a project contract', () => {
      //console.log(project.options.address);
      assert.ok(project.options.address); 
    });

    it('has 10 users set', async () => {
        const userCount = await project.methods.userCount().call();
        //console.log(users);
        assert.equal(userCount, 6);
    });

    it('has 1 tasks initialized', async () => {
        const taskCount = await project.methods.taskCount().call();
        assert.equal(taskCount, 1);
    });

    it('users are correct', async () => {
        let address = ''

        address = '0xB1227c941f830091900c1ACE26A8aa8Ed2339A75';
        const richard = await project.methods.users(0).call();
        assert.equal(richard[1], address);
        assert.equal(richard[2], 'Richard');
        assert.equal(richard[3], true);

        address = '0xd5DF28eF8CaFf46BEd9731ADd6DCE8Ce0a097434';
        const albert = await project.methods.users(1).call();
        assert.equal(albert[1], address);
        assert.equal(albert[2], 'Albert');
        assert.equal(albert[3], true);

        address = '0xAFb2c487c977998693f4729b5fa9F78cC1364782';
        const lukasz = await project.methods.users(2).call();
        assert.equal(lukasz[1], address);
        assert.equal(lukasz[2], 'Lukasz');
        assert.equal(lukasz[3], true);

        address = '0x0135Ed87462ed124f09Bd60C13c139e6E6D1EB12';
        const erika = await project.methods.users(3).call();
        assert.equal(erika[1], address);
        assert.equal(erika[2], 'Erika');
        assert.equal(erika[3], true);

        address = '0x440f11D755198e28CAf443953B8e573d9c03B64B';
        const robin = await project.methods.users(4).call();
        assert.equal(robin[1], address);
        assert.equal(robin[2], 'Robin');
        assert.equal(robin[3], true);

        address = '0xeeD3443bae2868D6A65f2775e0ACb4812BA6CAE0';
        const manuel = await project.methods.users(5).call();
        assert.equal(manuel[1], address);
        assert.equal(manuel[2], 'Manuel');
        assert.equal(manuel[3], true);
    });

    it('7. account is not set as user', async () => {
        address = accounts[7];
        const shouldNotExist = await project.methods.users(address).call();
        assert.equal(shouldNotExist[2], false);
    });

    it('user1 can create and assign task', async () => {
        const user1address = '0xB1227c941f830091900c1ACE26A8aa8Ed2339A75';
        const counterBefore = await project.methods.taskCount().call(); //should be 0

        const result = await project.methods.addTask('work work work',0).send({from: accounts[0], gas: 5000000});

        const counter = await project.methods.taskCount().call();
        
        assert.equal(counter, (Number(counterBefore)+1));

        const task = await project.methods.tasks(1).call();

        assert.equal(task['title'], 'work work work');
        assert.equal(task['createdBy'], 0);
        assert.equal(task['id'], counterBefore);
        assert.equal(task['assignedUserId'], 0);
    });

    it('assignee can not assign task to himself', async () => {
        let check;
        let error;
        try {
             check = await project.methods.assignTask(0,0).send({from: accounts[0], gas: 5000000});
        } catch (e) {
            error = e.message;
        }

        assert.equal(error, 'VM Exception while processing transaction: revert task cant be assigned to the assignee');
    })
});   			