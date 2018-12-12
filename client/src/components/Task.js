import React, { Component } from 'react'

export default class Task extends Component {
  render() {
    return (
      <div>
       <span>{this.props.title} </span>
       <span>({this.props.id})</span>
      </div>
    )
  }
}
