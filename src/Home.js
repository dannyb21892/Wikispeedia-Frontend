import React from "react"
import { Icon, Feed, Divider } from 'semantic-ui-react'
// import edit from "./assets/edit.png"
import gamepad from "./assets/gamepad-with-joystick (1).png"


class Home extends React.Component {
  state = {
    edits: [],
    followers: [],
    games: []
  }

  render(){
    let editFeed = this.state.edits.length > 0 ? (
      <Feed>
        {this.state.edits.map((e,i) => {
          return (
          <Feed.Event key={i}>
            <Feed.Label>
              <Icon name="edit" />
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                <a href={`${e.url}`}>{e.edit.title}</a><Feed.Date style={{color: "#808389"}}>{e.timestamp}</Feed.Date>
              </Feed.Summary>
              <Feed.Meta>
                {e.game}
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>
        )})}
      </Feed>
    ) : null
    let followFeed = this.state.followers.length > 0 ? (
      <Feed>
        {this.state.followers.map((f,i) => {
          return (
          <Feed.Event key={i}>
          <Feed.Label>
            <Icon name="game" />
          </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                <a href={`${f.url}/home`}>{f.game.title}</a>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        )})}
      </Feed>
    ) : null
    let topGameFeed = this.state.games.length > 0 ? (
      <Feed>
        {this.state.games.map((g,i) => {
          return (
          <Feed.Event key={i}>
            <Feed.Label image={gamepad} />
            <Feed.Content>
              <Feed.Summary>
                <a href={`/games/${g.slug}/home`}>{g.title}</a>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        )})}
      </Feed>
    ) : null
    return (
      <div className="home">
        <div className="recentEdits">
          <h3>Discover recently updated articles</h3>
          <Divider />
          {editFeed}
        </div>
        <div style={{display: this.props.loggedIn ? "intial" : "none"}} className="followers">
          <h3>Games you follow</h3>
          <Divider />
          {followFeed}
        </div>
        <div className="topGames">
          <h3>Most active speedgames</h3>
          <Divider />
          {topGameFeed}
        </div>
      </div>
    )
  }

  componentDidMount() {
    fetch("http://localhost:3000/api/v1/edits")
    .then(response => response.json())
    .then(json => {
      if(json.success){
        this.setState({
          edits: json.edits
        })
      }
    })
    if(this.props.loggedIn){
      fetch(`http://localhost:3000/api/v1/followers/${localStorage.getItem("username")}`)
      .then(response=>response.json())
      .then(json=>{
        if (json.success){
          this.setState({
            followers: json.followers
          })
        }
      })
    }
    fetch(`http://localhost:3000/api/v1/games`,{
      method: "POST",
      headers: {
       'Content-type':'application/json'
      },
      body: JSON.stringify({
        type: "home"
      })
    })
    .then(response=>response.json())
    .then(json=>{
      this.setState({
        games: json.games
      })
    })
  }
}
 export default Home
