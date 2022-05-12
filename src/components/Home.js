import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./navbar.component";
import EditMeal from "./edit-meal.component";
import AddMeal from "./add-meal.component";
import MealList from "./meal-list.component";
import SelectDate from "./meal-list.component";

export default function Home() {
  const history = useHistory();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    if (localStorage.getItem("token") === null) {
      history.push("/login");
    } else {
      userHasAuthenticated(true);
      console.log("User has authenticated");
    }

    setIsAuthenticating(false);
  }

  return (
    !isAuthenticating && (
      <div className="container">
        <Router>
          <Navbar />
          <br />
          <Route path="/" exact component={MealList} />
          <Route path="/edit/:id" exact component={EditMeal} />
          <Route path="/add" exact component={AddMeal} />
          <Route path="/selectDate" exact component={SelectDate} />
        </Router>
      </div>
    )
  );
}
