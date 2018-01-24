import React from "react"
import Questions from "./Questions"
import "./normalize.css"
import "./skeleton.css"
import "./d3Style.css"

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      onboarding: true
    }
  }

  render() {
    const style = {
      textAlign: "center",
      fontFamily: "Roboto, sans-serif",
      marginTop: "5rem"
    }

    const topMargin = {
      marginTop: "2.5rem"
    }

    if (this.state.onboarding) {
      return (
        <div className="container" style={style}>
          <div className="row">
            <h2 className="tagline-line1">
              <strong>RecruitCompute</strong>
            </h2>
          </div>
          <div className="row">
            <div className="offset-by-two eight columns">
              <h2 className="tagline-line2">
                Developing a hiring plan is hard work...especially when
                attrition is high.
              </h2>
              <br />
            </div>
          </div>

          <div className="row">
            <div className="offset-by-two eight columns">
              <h2 className="tagline-line2">
                We'll run thousands of company simulations so you can be
                prepared to hire <br />{" "}
                <em>the right number of people at the right time.</em>
              </h2>
              <br />
              <br />
            </div>
          </div>
          <button
            onClick={function() {
              this.setState({ onboarding: false })
            }.bind(this)}
          >
            Generate Plan
          </button>
        </div>
      )
    } else {
      return <Questions />
    }
  }
}

export default App
