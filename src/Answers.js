import React from "react"
import { LineChart } from "react-easy-chart"
import { Legend } from "react-easy-chart"
import { curveCatmullRom } from "d3-shape"
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries
} from "react-vis"
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

    const initialWidth = window.innerWidth > 0 ? window.innerWidth : 500

    this.state = {
      med_hired: returnObj.med_hired,
      med_lost: returnObj.med_lost,
      months: returnObj.med_company_history,
      worst_hired: returnObj.worst_hired,
      worst_lost: returnObj.worst_lost,
      worst_months: returnObj.worst_company_history,
      currMonth: 0,
      showToolTip: false,
      mobile: false,
      attrition: this.props.answers[2]
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

  componentDidMount() {
    window.addEventListener("resize", this.handleResize.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  handleResize() {
    if (window.innerWidth < 600) {
      this.setState({ mobile: true })
    } else {
      this.setState({ mobile: false })
    }
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
      textSize: "2em"
    }

    const yAxisStyle = {
      marginBottom: "-6rem",
      marginTop: "4rem",
      marginRight: "80%",
      transform: "rotate(-90deg)"
    }

    const topMargin = {
      marginTop: "3rem"
    }

    const legendData = [
      {
        key: this.state.attrition + "% Attrition (10th percentile)",
        value: 300,
        color: "#12939A"
      },
      {
        key: this.state.attrition + "% Attrition (median)",
        value: 200,
        color: "#79C7E3"
      },
      { key: "0% Attrition", value: 100, color: "#1A3177" }
    ]

    const buttonStyle = {
      margin: 12
    }

    const h4Style = {
      color: "grey"
    }

    const config = [
      { color: "#12939A" },
      { color: "#79C7E3" },
      { color: "#1A3177" }
    ]

    const headerStyle = {
      marginTop: "4 rem"
    }

    if (this.state.currMonth >= this.props.answers[1]) {
      return (
        <div className="container">
          <div className="row">
            <h2 className="tagline-line1">
              <strong>Projected Hiring Forecast</strong>
            </h2>
            <h2 className="tagline-line2">after 1000 simulations</h2>
            <XYPlot width={this.state.mobile ? 300 : 600} height={300}>
              <HorizontalGridLines style={{ stroke: "#B7E9ED" }} />
              <VerticalGridLines style={{ stroke: "#B7E9ED" }} />
              <XAxis
                title="Months"
                style={{
                  line: { stroke: "#ADDDE1" },
                  ticks: { stroke: "#ADDDE1" },
                  text: { stroke: "none", fill: "#6b6b76", fontWeight: 600 }
                }}
              />
              <YAxis title="Hires" />
              <LineSeries
                className="first-series"
                data={this.data[0]}
                style={{
                  strokeLinejoin: "round",
                  strokeWidth: 4
                }}
              />
              <LineSeries
                className="second-series"
                data={this.data[1]}
                style={{
                  strokeLinejoin: "round",
                  strokeWidth: 4
                }}
              />
              <LineSeries
                className="third-series"
                data={this.data[2]}
                style={{
                  strokeLinejoin: "round",
                  strokeWidth: 4
                }}
              />
            </XYPlot>
            <div>
              <h6>Months</h6>
            </div>
          </div>
          <div className="row">
            <Legend
              data={legendData}
              dataId={"key"}
              config={config}
              horizontal
            />
          </div>
          <div className="row">
            <h2 className="tagline-line2">
              Scroll down for more info, or&nbsp;
              <a href=".">go back to the beginning.</a>
            </h2>
          </div>
          <div className="row">
            <div className="four columns">
              <h2 className="tagline-line3">
                <strong>Summary</strong>
              </h2>
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
                  <span style={greenStyle}>
                    {" "}
                    {this.state.med_hired} employees
                  </span>.
                </p>
              </div>
            </div>
            <div className="eight columns">
              <h2 className="tagline-line3">
                <strong>Monthly Hiring Plan</strong>
              </h2>
              <MonthTable
                med_months={this.data[0]}
                worst_months={this.data[2]}
              />
            </div>
          </div>
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
            <strong>Simulating {this.props.answers[1]} Months ...</strong>
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
