pragma solidity ^0.5.1;

contract Project {
  struct Task {
    uint id;
    string title;
    uint assignedUserId;
    uint createdBy;
  }
  
  struct User {
    uint id;
    address key;
    string name;
    bool exists;
  }

  mapping(uint => User) public users;
  mapping(address => bool) public userExists;
  mapping(uint => Task) public tasks;
  
  uint public taskCount;
  uint public userCount;

  event taskAssigned(uint taskId, uint assignee);
  event newTaskCreated(uint taskId, string title);

  constructor() public {
    addUser(0xB1227c941f830091900c1ACE26A8aa8Ed2339A75, "Richard");
    addUser(0xd5DF28eF8CaFf46BEd9731ADd6DCE8Ce0a097434, "Albert");
    addUser(0xAFb2c487c977998693f4729b5fa9F78cC1364782, "Lukasz");
    addUser(0x0135Ed87462ed124f09Bd60C13c139e6E6D1EB12, "Erika");
    addUser(0x440f11D755198e28CAf443953B8e573d9c03B64B, "Robin");
    addUser(0xeeD3443bae2868D6A65f2775e0ACb4812BA6CAE0, "Manuel");

    addTask("task created by constructor", 0);
  }

  function addUser (address _address, string memory _name) private {
    users[userCount] = User(userCount, _address, _name, true);
    userExists[_address] = true;
    userCount++;
  }
  
  function addTask (string memory _title, uint creatorId) public {
    //require(userExists[msg.sender], "addTask is only available for registered users");
    tasks[taskCount] = Task(taskCount, _title, creatorId, creatorId);

    taskCount++;

    emit newTaskCreated((taskCount-1), _title);
  }
  
  function assignTask (uint _taskId, uint _userId) public {
    //require(userExists[msg.sender], "assignTask - only available for registered users");
    require(tasks[_taskId].assignedUserId != _userId, "task cant be assigned to the assignee");

    tasks[_taskId].assignedUserId = _userId;
    
    emit taskAssigned(_taskId, _userId);
  }
}