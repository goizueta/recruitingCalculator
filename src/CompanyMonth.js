import React from "react"
import simulate from "./utils.js"

export default class CompanyMonth extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hired: returnObj.hired,
      lost: returnObj.lost
    }
    console.log(returnObj)
  }

  render() {
    const greenStyle = {
      color: "green"
    }

    const redStyle = {
      color: "red"
    }

    return (
      <div>
        <h1>Here is your forecast:</h1>
        {this.props.answers[0]} months
        <h3>
          You will most likely lose{" "}
          <span style={redStyle}>{this.state.lost} employees</span> over{" "}
          {this.props.answers[0]} months.
        </h3>
        <h3>
          You will most likely have to hire
          <span style={greenStyle}> {this.state.hired} employees</span> to
          replace these employees and hit your growth targets.
        </h3>
      </div>
    )
  }
}
