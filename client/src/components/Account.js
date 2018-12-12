import React, { Component } from 'react'

export default class Account extends Component {
  render() {
    return (
      <div>
        <h2>{this.props.address}</h2>
        <h4>Balance: {this.props.balance} ETH</h4>
      </div>
    )
  }
}
