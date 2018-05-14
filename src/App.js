import React, { Component } from 'react';
import Login from "./Login"
import Logout from "./Logout"
import './App.css';

class App extends Component {
  state = {
    loggedIn: false,
    username: ""
  }

  getLogin = () => {
    return this.state.loggedIn ? <Logout logout={this.logout} username={this.state.username}/> : <Login logIn={this.logIn}/>
  }

  autoLogin = () => {
    // fetch("http://localhost:3000/api/v1/sessions")
    // .then(response=>response.json())
    // .then(json=>console.log(json))
    if (localStorage.getItem("username")){
      this.setState({
        loggedIn: true,
        username: localStorage.getItem("username")
      })
    }
  }

  logIn = (username) => {
    this.setState({
      loggedIn: true,
      username: username
    })
  }

  logout = () => {
    localStorage.removeItem("username")
    this.setState({
      loggedIn: false,
      username: ""
    })
  }

  componentWillMount() {
    this.autoLogin()
  }

  render() {
    return (
      <div className="App">
        {this.getLogin()}
      </div>
    );
  }
}

export default App;
