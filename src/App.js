import React, { Component } from 'react';
import AuthContainer from "./AuthContainer"
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
        <AuthContainer loggedIn={this.state.loggedIn} username={this.state.username} logout={this.logout} logIn={this.logIn}/>
      </div>
    );
  }

  componentWillUnmount(){
    localStorage.removeItem("username")
    localStorage.removeItem("pd")
    localStorage.removeItem("auto")
  }
}

export default App;
