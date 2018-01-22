import React from "react"
import PropTypes from "prop-types"
import Form from "./Form"
import Answers from "./Answers"
import "./normalize.css"
import "./skeleton.css"

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      questionIndex: 0,
      questions: [
        "How big is your company currently?",
        "How many months do you want to forecast into the future?",
        "How many employees left your company in the past year?",
        "What is your target yearly headcount growth rate (in percentage points)?"
      ],
      hints: [
        "(Examples: 10 or 100)",
        "(Example: 12 for a full year)",
        "(Example: 15)",
        "(Example: 50 if you want to grow by 50%)"
      ],
      answers: []
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(value) {
    this.state.answers.push(value)
    this.setState({ questionIndex: this.state.questionIndex + 1 })
  }

  render() {
    const style = {
      textAlign: "center",
      fontFamily: "Roboto, sans-serif",
      marginTop: "5rem"
    }

    const hintStyle = {
      color: "#8a8c8c",
      fontStyle: "italic",
      fontSize: ".9em",
      marginTop: "2.5rem"
    }

    if (this.state.questionIndex < 4) {
      return (
        <div className="container" style={style}>
          <h2 className="tagline-line1">
            <strong>Recruiting Calculator</strong>
          </h2>
          <h2 className="tagline-line2">
            {this.state.questions[this.state.questionIndex]}
          </h2>
          <p style={hintStyle}>{this.state.hints[this.state.questionIndex]}</p>
          <Form handleSubmit={this.handleSubmit} />
        </div>
      )
    } else {
      return (
        <div className="container" style={style}>
          <Answers answers={this.state.answers} />
        </div>
      )
    }
  }
}

App.propTypes = {
  txt: PropTypes.string,
  cat: PropTypes.number.isRequired
}

App.defaultProps = {
  txt: "This is default"
}

export default App
