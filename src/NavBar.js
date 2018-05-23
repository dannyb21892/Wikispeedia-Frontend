import React from "react"
import { Card, Icon, Image, Feed } from 'semantic-ui-react'
// https://react.semantic-ui.com/views/card#card-example-content-block
import icon from "./assets/gamepad-with-joystick (1).png"
import bell from "./assets/bell (1).png"
import redDot from "./assets/circle-8.png"

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
    let exactMatch = r.gameAlreadyExists ? (
      <Card.Content>
        <Card.Meta>
          Exact match
        </Card.Meta>
        <Feed>
          <Feed.Event>
            <Feed.Label image={icon} />
            <Feed.Content>
              <Feed.Summary>
                <a href={`http://localhost:3001/games/${r.game.slug.name}`}>{r.game.title}</a>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      </Card.Content>
    ) : null
    let sheader = r.suggestions.games.length > 0 ? "Games with similar titles" : "No matches found"
    let feed = r.suggestions.games.length > 0 ? (
      <Feed>
        {r.suggestions.games.slice(0,20).map((g,i) => {
          return (
          <Feed.Event key={i}>
            <Feed.Label image={icon} />
            <Feed.Content>
              <Feed.Summary>
                <a href={`http://localhost:3001/games/${r.suggestions.slugs[i].name}`}>{g.title}</a>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        )})}
      </Feed>
    ) : null
    let suggestions = (
      <Card.Content>
        <Card.Meta>
          {sheader}
        </Card.Meta>
        {feed}
      </Card.Content>
    )

  //   <Feed.Label image='/assets/images/avatar/small/jenny.jpg' />
  //   <Feed.Content>
  //     <Feed.Date content='1 day ago' />
  //     <Feed.Summary>
  //       You added <a>Jenny Hess</a> to your <a>coworker</a> group.
  //     </Feed.Summary>
  //   </Feed.Content>
  // </Feed.Event>
    return (
      <div style={{width: "30%", float: "right", marginTop: "40px", marginRight: "10px", height: "300px", overflow: "auto"}}>
        <Card fluid raised>
          {exactMatch}
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
    let dot = this.props.loggedIn ? <div style={{backgroundImage:`url(${redDot})`, height:8, width:8}}/> : null
    let notifications = this.props.loggedIn ? <li><div style={{backgroundImage: `url(${bell})`, width: 24, height: 24, marginTop: -17, marginLeft: -13, position: "absolute", cursor:"pointer"}}>{dot}</div></li> : null
    return (
      <header id="header" className="skel-layers-fixed">
				<h2><a href="/">WikiSpeedia</a></h2>
				<nav id="nav">
					<ul>
						<li><input type="text" placeholder="find a game" value={this.state.search} onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus}/></li>
						{profile}
            {notifications}
						{logInOrOut}
					</ul>
				</nav>
        {results}
			</header>
    )
  }
}

export default NavBar
