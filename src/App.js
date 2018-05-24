import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import AuthContainer from "./AuthContainer"
import MDE from "./MDE"
import NewGame from "./newGame"
import Game from "./Game"
import GamesContainer from "./GamesContainer"
import NavBar from "./NavBar"
import Article from "./Article"
import './App.css';

class App extends Component {
  state = {
    loggedIn: false,
    username: "",
    checkedLogin: false
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
      if (json.logged_in){
        this.logIn(localStorage.getItem("username"))
      } else {
        this.logIn("", true)
      }
    })
  }

  logIn = (username, setChecked) => {
    this.setState({
      loggedIn: username !== "",
      username: username,
      checkedLogin: true
    })
  }

  logout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("pd")
    localStorage.removeItem("auto")
    this.setState({
      loggedIn: false,
      username: ""
    })
  }

  componentWillMount() {
    this.autoLogin()
  }

  componentDidMount(){
    window.addEventListener('beforeunload', this.clearStorage);
  }

  createRouteComponent = (type, props) => {
    switch (type) {
      case "home":
        return <a href="http://localhost:3001/games">Games List</a>
      case "AuthContainer":
        return <AuthContainer loggedIn={this.state.loggedIn} username={this.state.username} logout={this.logout} logIn={this.logIn}/>
      case "MDE":
        return <MDE />
      case "newGame":
        return <NewGame loggedIn={this.state.loggedIn } URL={this.props.URL}/>
      case "gamesContainer":
        return <GamesContainer />
      case "game":
        return <Game loggedIn={this.state.loggedIn} {...props}/>
      case "article":
        return <Article checkedLogin={this.state.checkedLogin} loggedIn={this.state.loggedIn} {...props}/>
      default:
        return null
    }
  }

  render() {
    return (
      <div className="App">
        <NavBar loggedIn={this.state.loggedIn} logout={this.logout}/>
        <Router>
          <div className="Routes" >
            <Route exact strict path="/" render={()=>this.createRouteComponent("home")} />
            <Route exact path="/login" render={()=>this.createRouteComponent("AuthContainer")} />
            <Route exact path="/MDE" render={()=>this.createRouteComponent("MDE")} />
            <Route exact path="/newgame" render={()=>this.createRouteComponent("newGame")} />
            <Route exact path="/games" render={()=>this.createRouteComponent("gamesContainer")} />
            <Route exact path={`/games/:game`} render={(props)=>this.createRouteComponent("game",props)} />
            <Route path={`/games/:game/:article`} render={(props)=>this.createRouteComponent("article", props)}/>

          </div>
        </Router>
      </div>
    );
  }
// <Route path={`/games/:game/:article`} render={()=>this.createRouteComponent("article")} />
// render={()=>this.createRouteComponent("game")} />
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
