import React from "react"
import { LineChart } from "react-easy-chart"
import { Legend } from "react-easy-chart"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import RaisedButton from "material-ui/RaisedButton"
import simulate from "./utils.js"
import MonthTable from "./MonthTable"

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
    var new_employees_w_attrition = 0
    for (var i = 0; i < this.state.months.length; i++) {
      new_employees_w_attrition += this.state.months[i].filter(function(x) {
        return x == 0
      }).length
      var new_employees_wo_attrition =
        this.state.months[i].length - Number(this.props.answers[0])

      console.log("employees without attrition")
      console.log(new_employees_wo_attrition)
      line_one.push({ x: i + 1, y: new_employees_w_attrition })
      line_two.push({ x: i + 1, y: new_employees_wo_attrition })
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

    const yAxisStyle = {
      transform: "rotate(-90deg)",
      marginBottom: "-90px",
      marginRight: "700px"
    }

    const topMargin = {
      marginTop: "90px"
    }

    const legendData = [
      { key: "0% Attrition", value: 100, color: "blue" },
      { key: this.props.answers[2] + "% Attrition", value: 200, color: "green" }
    ]

    const buttonStyle = {
      margin: 12
    }

    const config = [{ color: "blue" }, { color: "green" }]

    if (this.state.currMonth >= this.props.answers[1]) {
      return (
        <div>
          <h2>Here is your median forecast after 1000 simulations</h2>
          <div style={topMargin}>
            <div style={yAxisStyle}>
              <p>Total New Hires</p>
            </div>
          </div>
          <LineChart
            axes
            lineColors={["green", "blue"]}
            margin={{ top: 10, right: 10, bottom: 25, left: 60 }}
            axisLabels={{ x: "Months", y: "Total New Hires" }}
            grid
            width={700}
            height={300}
            data={this.data}
          />
          <div>
            <p>Months</p>
          </div>

          <Legend data={legendData} dataId={"key"} config={config} horizontal />
          <h2>Summary</h2>
          <div style={leftIndent}>
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
          </div>
          <MonthTable months={this.data[0]} />
        </div>
      )
    } else {
      this.timeout = setTimeout(() => {
        this.setState({ currMonth: this.state.currMonth + 1 })
      }, 1000)

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
          <MuiThemeProvider>
            <RaisedButton
              label="Skip"
              style={buttonStyle}
              onClick={function() {
                clearTimeout(this.timeout)
                this.setState({ currMonth: this.props.answers[1] })
              }.bind(this)}
            />
          </MuiThemeProvider>
          <p style={leftIndent}>{row}</p>
        </div>
      )
    }
  }
}
