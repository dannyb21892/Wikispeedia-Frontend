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

  createRouteComponent = (type) => {
    switch (type) {
      case "AuthContainer":
        return <AuthContainer loggedIn={this.state.loggedIn} username={this.state.username} logout={this.logout} logIn={this.logIn}/>
      case "MDE":
        return <MDE />
      case "newGame":
        return <NewGame loggedIn={this.state.loggedIn } URL={this.props.URL}/>
      case "gamesContainer":
        return <GamesContainer />
      case "game":
        let slug = window.location.href.split("/games/")[1]
        return <Game slug={slug} createRouteComponent={this.createRouteComponent}/>
      case "article":
        return <Article content={<h1>title test</h1>}/>
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
            <Route exact path="/login" render={()=>this.createRouteComponent("AuthContainer")} />
            <Route exact path="/MDE" render={()=>this.createRouteComponent("MDE")} />
            <Route exact path="/newgame" render={()=>this.createRouteComponent("newGame")} />
            <Route exact path="/games" render={()=>this.createRouteComponent("gamesContainer")} />
            <Route exact path={`/games/:game`} component={Game} />
            <Route path={`/games/:game/:article`} component={Article} />

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
