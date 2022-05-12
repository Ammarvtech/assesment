import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import underscore from "underscore";

const Meal = (props) => (
  <tr bgcolor={props.meal.bgcolor}>
    <td>{props.meal.meal}</td>
    <td>{props.meal.calories}</td>
    <td>{props.meal.date.substring(0, 10)}</td>
    <td>
      <Link to={"/edit/" + props.meal._id}>edit</Link> |{" "}
      <a
        href="/"
        onClick={() => {
          props.deleteMeal(props.meal._id);
        }}
      >
        delete
      </a>
    </td>
  </tr>
);

export default class MealList extends Component {
  constructor(props) {
    super(props);

    this.deleteMeal = this.deleteMeal.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.state = { meals: [], dates: [], selectDate: false, groupByDates: [] };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/meals/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //Meals RED / GREEN Logic

        var tempMeals = response.data;
        let myMap = new Map();

        var distDate = [
          ...new Set(tempMeals.map((x) => x.date.substring(0, 10))),
        ];

        for (var j = 0; j < distDate.length; j++) {
          myMap[distDate[j]] = { calories: 0, greenFlag: true };
        }

        for (var i = 0; i < tempMeals.length; i++) {
          myMap[tempMeals[i].date.substring(0, 10)].calories +=
            tempMeals[i].calories;
          if (myMap[tempMeals[i].date.substring(0, 10)].calories > 2000)
            myMap[tempMeals[i].date.substring(0, 10)].greenFlag = false;
        }

        var ret = [
          ...new Object(
            tempMeals.map((x) => {
              var flagValue = "#FF9999";
              if (myMap[x.date.substring(0, 10)].greenFlag)
                flagValue = "#90ee90";
              x.bgcolor = flagValue;
              return x;
            })
          ),
        ];

        var groupDate = underscore.groupBy(ret, (meal) => {
          return meal.date.substring(0, 10);
        });

        this.setState({
          meals: ret,
          dates: distDate,
          groupByDates: groupDate,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteMeal(id) {
    const token = localStorage.getItem("token");
    axios
      .delete("http://localhost:4000/meals/me/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      });

    this.setState({
      meals: this.state.meals.filter((el) => el._id !== id),
    });

    window.location = "/";
  }

  mealList() {
    if (!this.state.selectDate) {
      return this.state.meals.map((currentmeal) => {
        return (
          <Meal
            meal={currentmeal}
            deleteMeal={this.deleteMeal}
            key={currentmeal._id}
          />
        );
      });
    } else {
      return this.state.selectMeals.map((currentmeal) => {
        return (
          <Meal
            meal={currentmeal}
            deleteMeal={this.deleteMeal}
            key={currentmeal._id}
          />
        );
      });
    }
  }

  onChangeDate(date) {
    if (!(date.target.value === "Select Date")) {
      this.setState({
        selectDate: true,
        selectMeals: this.state.groupByDates[date.target.value],
      });
    } else {
      this.setState({
        selectDate: false,
      });
    }
  }

  render() {
    return (
      <div>
        <div>
          <h3>All Meals</h3>
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th>Meal</th>
                <th>Calories</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.mealList()}</tbody>
          </table>
        </div>
        <select
          name="dates"
          className="form-control"
          placeholder="Select Date"
          onClick={this.onChangeDate}
        >
          <option key="Select Date" value="Select Date">
            Select Date
          </option>
          {this.state.dates.map(function (date) {
            return (
              <option key={date} value={date}>
                {date}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}
