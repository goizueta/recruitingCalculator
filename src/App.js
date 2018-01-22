import React from "react"
import PropTypes from "prop-types"
import Form from "./Form"
import Answers from "./Answers"

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
      fontFamily: "Roboto, sans-serif"
    }

    const hintStyle = {
      color: "#8a8c8c",
      fontStyle: "italic",
      fontSize: ".9em"
    }

    if (this.state.questionIndex < 4) {
      return (
        <div style={style}>
          <h1>Recruiting Calculator</h1>
          <h3>{this.state.questions[this.state.questionIndex]}</h3>
          <p style={hintStyle}>{this.state.hints[this.state.questionIndex]}</p>
          <Form handleSubmit={this.handleSubmit} />
        </div>
      )
    } else {
      return (
        <div style={style}>
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
