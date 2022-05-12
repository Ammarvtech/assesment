import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class EditMeal extends Component {
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

  componentDidMount() {
    const token = localStorage.getItem("token");
    console.log(this.props.match.params.id);
    axios
      .get("http://localhost:4000/meals/me/" + this.props.match.params.id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Fix constant error
        var date = new Date(response.data.date);
        date.setDate(date.getDate() - 1);

        this.setState({
          meal: response.data.meal,
          calories: response.data.calories,
          date: date,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onChangeMeal(e) {
    this.setState({
      meal: e.target.value,
    });
  }

  onChangeCalories(e) {
    this.setState({ calories: e.target.value });
  }

  onChangeDate(date) {
    this.setState({
      date: date,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    // Fix constant error
    var date = this.state.date;
    date.setDate(date.getDate() + 1);
    const meal = {
      username: username,
      meal: this.state.meal,
      calories: this.state.calories,
      date: date,
    };

    axios
      .put(
        "http://localhost:4000/meals/me/" + this.props.match.params.id,
        meal,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => console.log(res.data));

    window.location = "/";
  }

  render() {
    return (
      <div>
        <h3>Edit Meal</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Meal </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.meal}
              onChange={this.onChangeMeal}
            />
          </div>
          <div className="form-group">
            <label>Calories </label>
            <input
              type="number"
              required
              className="form-control"
              value={this.state.calories}
              onChange={this.onChangeCalories}
            />
          </div>
          <div className="form-group">
            <label>Date </label>
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
              value="Edit Meal"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
