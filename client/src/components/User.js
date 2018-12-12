import React, { Component } from 'react'
import Task from './Task'

export default class User extends Component {
  render() {
    console.log(this.props.name);
    console.log(this.props.isCurrentUser)
    return (
      <div>
        {
          this.props.isCurrentUser ? <h4 className="markCurrentUser">{this.props.name}</h4> : <h4>{this.props.name}</h4>
        }
        <h5>{this.props.id} / {this.props.address}</h5>
        {
          this.props.tasks.map(task => {
            return (<Task key={"task" + task.id} id={task.id} title={task.title} />);
          })
        }
      </div>
    )
  }
}
