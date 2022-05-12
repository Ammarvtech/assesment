import React, { Component } from "react";
import "./style.scss";
import Login from "./Login";
import SignUp from "./SignUp";

export class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logginActive: true,
      user: {},
    };
  }

  changeState() {
    const { logginActive } = this.state;
    if (logginActive) {
      this.otherSide.classList.remove("right");
      this.otherSide.classList.add("left");
    } else {
      this.otherSide.classList.remove("left");
      this.otherSide.classList.add("right");
    }
    this.setState((prevState) => ({ logginActive: !prevState.logginActive }));
  }

  render() {
    const { logginActive } = this.state;
    const current = logginActive ? "SignUp" : "LogIn";
    // const curentActive = logginActive ? "login" : "signup";
    return (
      <div className="App">
        <div className="login">
          <div className="container">
            {logginActive && (
              <Login containerRef={(ref) => (this.current = ref)} />
            )}
            {!logginActive && (
              <SignUp containerRef={(ref) => (this.current = ref)} />
            )}
          </div>
          <OtherSide
            current={current}
            containerRef={(ref) => (this.otherSide = ref)}
            onClick={this.changeState.bind(this)}
          />
        </div>
      </div>
    );
  }
}

const OtherSide = (props) => {
  return (
    <div
      className="other-side right"
      ref={props.containerRef}
      onClick={props.onClick}
    >
      <div className="inner-container">
        <div className="text">{props.current}</div>
      </div>
    </div>
  );
};
