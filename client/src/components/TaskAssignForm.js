import React, { Component } from 'react'

export default class TaskFormAssign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      taskId: 0,
    };

    this.handleUserUpdate = this.handleUserUpdate.bind(this);
    this.handleTaskUpdate = this.handleTaskUpdate.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTaskUpdate(event) {
    this.setState({taskId: event.target.value});
  }

  handleUserUpdate(event) {
    this.setState({userId: event.target.value});

  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onAssign(this.state.taskId, this.state.userId);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick a task to assign:
          <select value={this.state.taskId} onChange={this.handleTaskUpdate}>
            {
              this.props.tasks.map(task => {
                return (<option key={'assignTask' + task.id} value={task.id}>{task.title}</option>);
              })
            }
          </select>
          Pick an assignee:
          <select value={this.state.userId} onChange={this.handleUserUpdate}>
            {
              this.props.users.map(user => {
                return (<option key={'assignUser' + user.id} value={user.id}>{user.name}</option>);
              })
            }
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
