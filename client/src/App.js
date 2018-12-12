import React, { Component } from 'react';
import Web3 from 'web3';
import config from './config/contracts';
import Account from './components/Account';
import User from './components/User';
import TaskCreateForm from './components/TaskCreateForm';
import TaskAssignForm from './components/TaskAssignForm';

import './App.css';


class App extends Component {
  web3;
  project;
  deploymentData;
  balance = "unknown";
  myAddress = "unknown";

  constructor(props, context) {
    super(props, context);
    this.web3 = new Web3(window.web3.currentProvider);
    this.deploymentData = config.find(item => item.name === 'Project');
    this.project = new this.web3.eth.Contract(this.deploymentData.abi, this.deploymentData.address);

    this.state = {
      balance: 'unknown',
      myAddress: 'unknown',
      users: [],
      tasks: [],
    }

    this.update();
  }

  async createTask(title) {
    console.log(title);
    const currentUser = this.state.users.find(user => user.key === this.state.myAddress);

    if (currentUser === undefined) {
      alert(this.state.myAddress + " is not part of the user group");
      return;
    }
    const x = await this.project.methods.addTask(title, currentUser.id).send({from: this.state.myAddress, gas: 500000});

    console.log(currentUser.id);
    console.log(x);
    
    this.update();
  }

  async assignTask(taskId, userId) {
    let result;
    try {
      result = await this.project.methods.assignTask(taskId, userId).send({from: this.state.myAddress, gas: 500000});
    } catch (error) {
      console.error(result);
    }
    console.log(result);

    this.update();
  }

  async update() {
    await window.ethereum.enable();

    const accounts = await this.web3.eth.getAccounts();
    const balance = this.web3.utils.fromWei(await this.web3.eth.getBalance(accounts[0]),'ether');
    const myAddress = accounts[0];

    const userCount = await this.project.methods.userCount().call();
    const taskCount = await this.project.methods.taskCount().call();

    let tasks = [];
    for (let i = 0; i < taskCount; i++) {
      const task = await this.project.methods.tasks(i).call();
      tasks.push(task);
    }

    let users = [];
    for (let i = 0; i < userCount; i++) {
      const user = await this.project.methods.users(i).call();
      const usersTasks = tasks.filter(task => task.assignedUserId === user.id);
      users.push({...user, tasks: usersTasks});
    }


    this.setState({
      balance,
      myAddress,
      users,
      tasks,
    });

    console.log("UserCount: " + userCount);
    console.log(users);
    console.log("TaskCount: " + taskCount);
    console.log(tasks);
  }

  render() {
    //this.getData();
    return (
      <div className="App">
        <Account address={this.state.myAddress} balance={this.state.balance} />
        <hr />
        {
          this.state.users.map(user => {
            return <User key={user.key+user.id} name={user.name} address={user.key} id={user.id} tasks={user.tasks} isCurrentUser={user.key ===this.state.myAddress}/>
          })
        }
        <TaskCreateForm onCreate={(title) => this.createTask(title)}/>
        <TaskAssignForm onAssign={(taskId, userId) => this.assignTask(taskId, userId)} users={this.state.users} tasks={this.state.tasks} />
      </div>
    );
  }
}

export default App;
