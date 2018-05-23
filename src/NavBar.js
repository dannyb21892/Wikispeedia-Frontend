import React from "react"
import { Card, Icon, Image, Feed } from 'semantic-ui-react'
// https://react.semantic-ui.com/views/card#card-example-content-block
import icon from "./assets/gamepad-with-joystick (1).png"

class NavBar extends React.Component {
  state = {
    search: "",
    results: {}
  }

  handleChange = e => {
    if (e.target.value !== ""){
      this.setState({
        search: e.target.value
      },this.search)
    } else {
      this.setState({
        search: e.target.value,
        results: {}
      })
    }
  }

  search = () => {
    fetch("http://localhost:3000/api/v1/games",{
      method: "POST",
      headers: {
       'Content-type':'application/json'
      },
      body: JSON.stringify({
        type: "checkGame",
        title: this.state.search
      })
    })
    .then(response => response.json())
    .then(json => {
      this.setState({results: json})
    })
  }

  searchResults = () => {
    let r = this.state.results
    let exactMatch = r.gameAlreadyExists ? <Card.Content><a>{r.game.title}</a></Card.Content> : null
    let sheader = r.suggestions.games.length > 0 ? (
      <Card.Content>
        <Card.Header>
          Games with similar titles
        </Card.Header>
      </Card.Content>
    ) : null
    let suggestions = r.suggestions.games.length > 0 ? (
      <Card.Content>
        <Feed>
          {r.suggestions.games.map((g,i) => {
            return (
            <Feed.Event>
              <Feed.Label image={icon} />
              <Feed.Content>
                <Feed.Summary>
                  <a href={`http://localhost:3001/games/${r.suggestions.slugs[i].name}`}>{g.title}</a>
                </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          )})}
        </Feed>
      </Card.Content>
    ) : null
  //   <Feed.Label image='/assets/images/avatar/small/jenny.jpg' />
  //   <Feed.Content>
  //     <Feed.Date content='1 day ago' />
  //     <Feed.Summary>
  //       You added <a>Jenny Hess</a> to your <a>coworker</a> group.
  //     </Feed.Summary>
  //   </Feed.Content>
  // </Feed.Event>
    return (
      <div style={{width: "30%", float: "right", marginTop: "40px", height: "150px", overflow: "auto"}}>
        <Card fluid raised>
          {exactMatch}
          {sheader}
          {suggestions}
        </Card>
      </div>
    )
    // <div style={{color: "red", display:"block"}}>
    //   {exactMatch}
    //   {suggestions}
    // </div>
  }

  handleBlur = () => {
    setTimeout(() => this.setState({results: {}}), 500)
  }

  handleFocus = (e) => {
    if(e.target.value !== ""){
      this.search()
    }
  }

  render() {
    let logInOrOut = this.props.loggedIn ? <li className="button"><a onClick={this.props.logout} className="button special">Log Out</a></li> : <li className="button special"><a href="/login" className="button special">Sign Up or Log In</a></li>
    let profile = this.props.loggedIn ? <li className="button"><a onClick={() => window.location.href = `http://localhost:3001/users/${localStorage.getItem("username")}`} className="button special">{localStorage.getItem("username")}</a></li> : null
    let results = Object.keys(this.state.results).length > 0 ? this.searchResults() : null
    return (
      <header id="header" className="skel-layers-fixed">
				<h2><a href="/">WikiSpeedia</a></h2>
				<nav id="nav">
					<ul>
						<li><input type="text" placeholder="find a game" value={this.state.search} onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus}/></li>
						{profile}
						{logInOrOut}
					</ul>
				</nav>
        {results}
			</header>
    )
  }
}

export default NavBar
