import React from "react"
import { Card, Icon, Image, Feed } from 'semantic-ui-react'
// https://react.semantic-ui.com/views/card#card-example-content-block
import icon from "./assets/gamepad-with-joystick (1).png"
import bell from "./assets/bell (1).png"
import redDot from "./assets/circle-8.png"
import edit from "./assets/edit.png"

class NavBar extends React.Component {
  state = {
    search: "",
    results: {},
    notifications: [],
    checkedNotifications: false,
    showNotifications: false,
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
    return (
      <div style={{width: "30%", float: "right", marginTop: "40px", marginRight: "10px", height: "300px", overflow: "auto"}}>
        <Card fluid raised>
          {exactMatch}
          {suggestions}
        </Card>
      </div>
    )
  }

  getNotifications = () => {
    let n = this.state.notifications
    let nheader = n.length > 0 ? "Recently Edited Articles Need Approval" : "You have no notifications"
    let feed = n.length > 0 ? (
      <Feed>
        {n.map((e,i) => {
          return (
          <Feed.Event key={i}>
            <Feed.Label image={edit} />
            <Feed.Content>
              <Feed.Summary>
                <a href={`${e.url}${e.edit.title.replace(/[!@#$%^&*()+={}|[\]\\;'"`~:<>?,./]/g,"").replace(/[-]/g,"_").replace(/\s/g,"_")}`}>{e.edit.title}</a>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        )})}
      </Feed>
    ) : null
    let notifications = (
      <Card.Content>
        <Card.Meta>
          {nheader}
        </Card.Meta>
        {feed}
      </Card.Content>
    )
    return (
      <div style={{width: "30%", float: "right", marginTop: "40px", marginRight: "10px", height: "300px", overflow: "auto"}}>
        <Card fluid raised>
          {notifications}
        </Card>
      </div>
    )
  }

  handleBlur = (e, type) => {
    if (type === "search") {
      setTimeout(() => this.setState({results: {}}), 500)
    } else if (type === "notifications") {
      setTimeout(() => this.setState({showNotifications: false}), 500)
    }
  }

  handleFocus = (e, type) => {
    if (type === "search") {
      if(this.state.showNotifications){this.setState({showNotifications: false})}
      if(e.target.value !== ""){
        this.search()
      }
    } else if (type === "notifications") {
      this.setState({showNotifications: true})
    }
  }

  render() {
    let logInOrOut = this.props.loggedIn ? <li className="button"><a onClick={this.props.logout} className="button special">Log Out</a></li> : <li className="button special"><a href="/login" className="button special">Sign Up or Log In</a></li>
    let profile = this.props.loggedIn ? <li className="button"><a onClick={() => window.location.href = `http://localhost:3001/users/${localStorage.getItem("username")}`} className="button special">{localStorage.getItem("username")}</a></li> : null
    let results = Object.keys(this.state.results).length > 0 && !this.state.showNotifications ? this.searchResults() : null
    let dot = this.state.notifications.length > 0 ? <div style={{backgroundImage:`url(${redDot})`, height:8, width:8}}/> : null
    let bellDiv = this.props.loggedIn ? <li><div className ="notifications" tabIndex={-1} onMouseDown={() => this.setState({showNotifications: !this.state.showNotifications})} onBlur={(e)=>this.handleBlur(e,"notifications")} style={{backgroundImage: `url(${bell})`, width: 24, height: 24, marginTop: -17, marginLeft: -13, position: "absolute", cursor:"pointer"}}>{dot}</div></li> : null
    let notifications = this.state.showNotifications ? this.getNotifications() : null
    return (
      <header id="header" className="skel-layers-fixed">
				<h2><a href="/">WikiSpeedia</a></h2>
				<nav id="nav">
					<ul>
						<li><input type="text" placeholder="find a game" value={this.state.search} onChange={this.handleChange} onBlur={(e) => this.handleBlur(e, "search")} onFocus={(e) => this.handleFocus(e, "search")}/></li>
						{profile}
            {bellDiv}
						{logInOrOut}
					</ul>
				</nav>
        {results}
        {notifications}
			</header>
    )
  }

  componentDidUpdate() {
    if(this.props.loggedIn && !this.state.checkedNotifications){
      console.log("fetching")
      fetch("http://localhost:3000/api/v1/users",{
        method: "POST",
        headers: {
         'Content-type':'application/json'
        },
        body: JSON.stringify({
          type: "checkNotifications",
          username: localStorage.getItem("username"),
        })
      })
      .then(response => response.json())
      .then(json => this.setState({
        notifications: json.notifications,
        checkedNotifications: true
      }))
    }
  }
}

export default NavBar
