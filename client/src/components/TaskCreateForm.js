import React, { Component } from 'react'

export default class TaskCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onCreate(this.state.value);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Title:
                <input type="text" name="name" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Add Task" />
        </form>
      </div>
    )
  }
}
