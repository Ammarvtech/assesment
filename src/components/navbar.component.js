import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  async handleLogout() {
    console.log("Logout");
    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:4000/users/me/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          window.location = "/login";
        }
      });
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
          <Link to="/" className="navbar-brand">
            Calories Tracker
          </Link>
        </nav>
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
          <div className="collpase navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link to="/" className="nav-link">
                  All Meals
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/add" className="nav-link">
                  Add Meal
                </Link>
              </li>
            </ul>
          </div>
          <Link
            to="/login"
            className=" btn btn-outline-success my-2 my-sm-0"
            onClick={this.handleLogout}
          >
            Log Out
          </Link>
        </nav>
      </div>
    );
  }
}
