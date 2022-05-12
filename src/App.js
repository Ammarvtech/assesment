import React, { useState, useEffect } from "react";
import { AppContext } from "./libs/contextLib";
import "./App.scss";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import { Auth } from "./components/auth/Auth";
import Home from "./components/Home";

export default function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  return (
    <Router>
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Route exact path="/login" component={Auth} />
        <Route exact path="/" component={Home} />
      </AppContext.Provider>
    </Router>
  );
}
