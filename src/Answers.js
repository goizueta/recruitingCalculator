import React from "react"
import { LineChart } from "react-easy-chart"
import simulate from "./utils.js"

export default class Answers extends React.Component {
  constructor(props) {
    super(props)

    var returnObj = simulate(
      Number(this.props.answers[0]),
      Number(this.props.answers[1]),
      Number(this.props.answers[2]),
      Number(this.props.answers[3])
    )

    this.state = {
      hired: returnObj.hired,
      lost: returnObj.lost,
      months: returnObj.company_history,
      currMonth: 0
    }
    console.log(returnObj)

    var line_one = [] //with attrition
    var line_two = [] //without attrition
    for (var i = 0; i < this.state.months.length; i++) {
      var new_employees_w_attrition = this.state.months[i].filter(function(x) {
        return x <= i
      }).length
      var new_employees_wo_attrition =
        this.state.months[i].length - Number(this.props.answers[0])

      line_one.push({ x: i, y: new_employees_w_attrition })
      line_two.push({ x: i, y: new_employees_wo_attrition })
    }
    this.data = [line_one, line_two]
  }

  render() {
    const greenStyle = {
      color: "green",
      fontWeight: "bold"
    }

    const redStyle = {
      color: "red",
      fontWeight: "bold"
    }

    const boldStyle = {
      fontWeight: "bold"
    }

    const leftIndent = {
      textAlign: "left",
      marginLeft: "20%",
      marginRight: "20%",
      textSize: "2em"
    }

    if (this.state.currMonth >= this.props.answers[1]) {
      return (
        <div>
          <h1>Here is your forecast after 1000 simulations:</h1>
          Over {this.props.answers[1]} months
          <p>
            You will most likely lose{" "}
            <span style={redStyle}>{this.state.lost} employees</span>
          </p>
          <p>
            ... and have to hire{" "}
            <span style={boldStyle}>
              {this.state.months[this.state.months.length - 1].length -
                this.props.answers[0]}{" "}
            </span>
            planned employees to hit your growth targets.
          </p>
          <p>
            This means hiring a total of
            <span style={greenStyle}> {this.state.hired} employees</span>.
          </p>
          <LineChart
            axes
            axisLabels={{ x: "Months", y: "Total New Hires" }}
            grid
            data={this.data}
          />
        </div>
      )
    } else {
      setTimeout(() => {
        this.setState({ currMonth: this.state.currMonth + 1 })
      }, 100)

      console.log(this.state.currMonth)
      var row = ""
      var companySize = this.state.months[this.state.currMonth].length
      var lostEmployees = 0
      var newEmployees = 0

      for (var i = 0; i < companySize; i++) {
        var employeeAge = this.state.months[this.state.currMonth][i]
        var nextEmployeeAge = this.state.months[this.state.currMonth][i + 1]
        if (
          (employeeAge === 0 && nextEmployeeAge === 0) ||
          (employeeAge === 0 && nextEmployeeAge == null)
        ) {
          row += "➕"
          newEmployees++
        } else if (employeeAge === 0) {
          row += "💀"
          lostEmployees++
        } else {
          row += "👩‍💼" //Math.random() > 0.5 ? "👨‍💼" : "👩‍💼"
        }
      }
      return (
        <div>
          <h1>Simulating {this.props.answers[1]} Months ...</h1>
          <h3>
            After {this.state.currMonth + 1} Months <br />
          </h3>
          <p style={leftIndent}>
            Employees Lost This Month: {lostEmployees} <br />
            New Employees This Month: {newEmployees} <br />
            <br />
            Total Company Size: {companySize} <br />
            <br />
            👩‍💼 = 1 employee &nbsp;&nbsp;&nbsp;&nbsp; ➕ = 1 hired employee
            &nbsp;&nbsp;&nbsp;&nbsp; 💀 = 1 lost employee <br />
          </p>
          <p style={leftIndent}>{row}</p>
        </div>
      )
    }
  }
}
