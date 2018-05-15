import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import AuthContainer from "./AuthContainer"
import MDE from "./MDE"
import './App.css';

class App extends Component {
  state = {
    loggedIn: false,
    username: ""
  }

  autoLogin = () => {
    fetch("http://localhost:3000/api/v1/users",{
      method: "POST",
      headers: {
       'Content-type':'application/json'
      },
      body: JSON.stringify({
        type: "login",
        username: localStorage.getItem("username"),
        pd: localStorage.getItem("pd")
      })
    })
    .then(response=>response.json())
    .then(json=>{
      console.log(json)
      if (json.logged_in){
        this.logIn(localStorage.getItem("username"))
      }
    })
  }

  logIn = (username) => {
    this.setState({
      loggedIn: true,
      username: username
    })
  }

  logout = () => {
    this.clearStorage()
    this.setState({
      loggedIn: false,
      username: ""
    })
  }

  componentWillMount() {
    this.autoLogin()
  }

  componentDidMount(){
    window.addEventListener('beforeunload', this.logout);
  }

  createRouteComponent = (type) => {
    switch (type) {
      case "AuthContainer":
        return <AuthContainer loggedIn={this.state.loggedIn} username={this.state.username} logout={this.logout} logIn={this.logIn}/>
      case "MDE":
        return <MDE />
      default:
        return null
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" render={()=>this.createRouteComponent("AuthContainer")} />
          <Route exact path="/MDE" render={()=>this.createRouteComponent("MDE")} />
        </div>
      </Router>
    );
  }

  clearStorage(){
    if (localStorage.getItem("auto") !== "true") {
      localStorage.removeItem("username")
      localStorage.removeItem("pd")
      localStorage.removeItem("auto")
    }
    window.removeEventListener('beforeunload', this.clearStorage)
  }
}

export default App;
