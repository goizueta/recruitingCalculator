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
        "What is the yearly attrition rate at your company (in percentage points)?",
        "What is your target monthly headcount growth rate (in percentage points)?"
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
      textAlign: "center"
    }

    if (this.state.questionIndex < 4) {
      return (
        <div style={style}>
          <h1>Recruiting Calculator</h1>
          <h3>{this.state.questions[this.state.questionIndex]}</h3>
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
