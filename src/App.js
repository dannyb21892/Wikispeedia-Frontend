import React, { Component } from 'react';
import Login from "./Login"
import './App.css';

class App extends Component {
  state = {
    loggedIn: false,
    username: ""
  }

  getLogin = () => {
    return this.state.loggedIn ? "LOGGED IN :D" : <Login logIn={this.logIn}/>
  }

  logIn = (username) => {
    this.setState({
      loggedIn: true,
      username: username
    })
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
