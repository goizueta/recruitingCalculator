import React from "react"

export default class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: "",
      disabled: true
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    var re = /^[0-9]+$/
    if (re.test(event.target.value)) {
      this.setState({ value: event.target.value, disabled: false })
    } else {
      this.setState({ value: event.target.value, disabled: true })
    }
  }

  handleSubmit(event) {
    this.props.handleSubmit(this.state.value)
    this.setState({ value: "", disabled: true })
    event.preventDefault()
  }

  render() {
    const redStyle = {
      color: "#c30",
      fontWeight: "lighter"
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
            maxlength="4"
          />
          <br />
          <input type="submit" value="Submit" disabled={this.state.disabled} />
        </form>
        <p
          hidden={
            !this.state.disabled ||
            (this.state.value === "" && this.state.disabled)
          }
          style={redStyle}
        >
          Please enter only numeric digits.
        </p>
      </div>
    )
  }
}
