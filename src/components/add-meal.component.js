import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class AddMeal extends Component {
  constructor(props) {
    super(props);

    this.onChangeMeal = this.onChangeMeal.bind(this);
    this.onChangeCalories = this.onChangeCalories.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      meal: "",
      calories: 0,
      date: new Date(),
      users: [],
    };
  }

  onChangeMeal(e) {
    this.setState({
      meal: e.target.value,
    });
  }

  onChangeCalories(e) {
    this.setState({
      calories: e.target.value,
    });
  }

  onChangeDate(date) {
    this.setState({
      date: date,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    // Fix constant error
    var date = this.state.date;
    date.setDate(date.getDate() + 1);
    const meal = {
      username: username,
      meal: this.state.meal,
      calories: this.state.calories,
      date: date,
    };

    console.log(meal);

    axios
      .post("http://localhost:4000/meals/me", meal, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => console.log(res.data));

    window.location = "/";
  }

  render() {
    return (
      <div>
        <h3>Record New Meal</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Meal: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.meal}
              onChange={this.onChangeMeal}
            />
          </div>
          <div className="form-group">
            <label>Calories : </label>
            <input
              type="number"
              className="form-control"
              value={this.state.calories}
              onChange={this.onChangeCalories}
            />
          </div>
          <div className="form-group">
            <label>Date: </label>
            <div>
              <DatePicker
                selected={this.state.date}
                onChange={this.onChangeDate}
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Record New Meal"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
