import React from "react"
import { LineChart } from "react-easy-chart"
import { Legend } from "react-easy-chart"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
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
      med_hired: returnObj.med_hired,
      med_lost: returnObj.med_lost,
      months: returnObj.med_company_history,
      worst_hired: returnObj.worst_hired,
      worst_lost: returnObj.worst_lost,
      worst_months: returnObj.worst_company_history,
      currMonth: 0
    }

    var line_one = [] //with attrition
    var line_two = [] //without attrition
    var line_three = [] //worst 10%
    var new_employees_w_attrition = 0
    var new_employees_w_worst_attrition = 0
    for (var i = 0; i < this.state.months.length; i++) {
      new_employees_w_attrition += this.state.months[i].filter(function(x) {
        return x === 0
      }).length
      new_employees_w_worst_attrition += this.state.worst_months[i].filter(
        function(x) {
          return x === 0
        }
      ).length
      var new_employees_wo_attrition =
        this.state.months[i].length - Number(this.props.answers[0])

      line_one.push({ x: i + 1, y: new_employees_w_attrition })
      line_two.push({ x: i + 1, y: new_employees_wo_attrition })
      line_three.push({ x: i + 1, y: new_employees_w_worst_attrition })
    }
    this.data = [line_three, line_one, line_two]
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
      marginRight: "20%",
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
      {
        key: this.props.answers[2] + "% Attrition (10th percentile)",
        value: 300,
        color: "#4A6670"
      },
      {
        key: this.props.answers[2] + "% Attrition (median)",
        value: 200,
        color: "#668F80"
      },
      { key: "0% Attrition", value: 100, color: "#C3B59F" }
    ]

    const buttonStyle = {
      margin: 12
    }

    const h4Style = {
      color: "grey"
    }

    const config = [
      { color: "#4A6670" },
      { color: "#668F80" },
      { color: "#C3B59F" }
    ]

    const headerStyle = {
      marginTop: "4 rem"
    }

    if (this.state.currMonth >= this.props.answers[1]) {
      return (
        <div>
          <h2>Projected Hiring Forecast</h2>
          <h4 style={h4Style}>after 1000 simulations</h4>
          <div style={topMargin}>
            <div style={yAxisStyle}>
              <p>Total New Hires</p>
            </div>
          </div>
          <LineChart
            axes
            lineColors={["#4A6670", "#668F80", "#C3B59F"]}
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
              <span style={redStyle}>{this.state.med_lost} employees</span>
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
              <span style={greenStyle}> {this.state.med_hired} employees</span>.
            </p>
          </div>
          <MonthTable med_months={this.data[0]} worst_months={this.data[2]} />
        </div>
      )
    } else {
      this.timeout = setTimeout(() => {
        this.setState({ currMonth: this.state.currMonth + 1 })
      }, 1000)

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
        <div className="container">
          <h2 className="tagline-line1">
            Simulating {this.props.answers[1]} Months ...
          </h2>
          <h2 className="tagline-line2">
            After {this.state.currMonth + 1} Months <br />
          </h2>
          <p style={leftIndent}>{row}</p>
          <p style={leftIndent}>
            👩‍💼 = 1 employee &nbsp;&nbsp;&nbsp;&nbsp; ➕ = 1 hired employee
            &nbsp;&nbsp;&nbsp;&nbsp; 💀 = 1 lost employee <br />
            Total Company Size: {companySize} <br />
          </p>
          <MuiThemeProvider>
            <button
              style={buttonStyle}
              onClick={function() {
                clearTimeout(this.timeout)
                this.setState({ currMonth: this.props.answers[1] })
              }.bind(this)}
            >
              Skip
            </button>
          </MuiThemeProvider>
        </div>
      )
    }
  }
}
