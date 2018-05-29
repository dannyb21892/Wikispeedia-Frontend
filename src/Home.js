import React from "react"
import { Card, Icon, Image, Feed } from 'semantic-ui-react'
import edit from "./assets/edit.png"
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
            <Feed.Label image={edit} />
            <Feed.Content>
              <Feed.Summary>
                <a href={`${e.url}`}>{e.edit.title}</a>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        )})}
      </Feed>
    ) : null
    let recentEdits = (
      <Card fluid raised>
        <Card.Content>
          <Card.Header>
            Discover recently updated articles
          </Card.Header>
          {editFeed}
        </Card.Content>
      </Card>
    )
    let followFeed = this.state.followers.length > 0 ? (
      <Feed>
        {this.state.followers.map((f,i) => {
          return (
          <Feed.Event key={i}>
            <Feed.Label image={gamepad} />
            <Feed.Content>
              <Feed.Summary>
                <a href={`${f.url}/home`}>{f.game.title}</a>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        )})}
      </Feed>
    ) : null
    let followers = <Card fluid raised>
      <Card.Content>
        <Card.Header>
          Games you follow
        </Card.Header>
        {followFeed}
      </Card.Content>
    </Card>
    let topGameFeed = this.state.followers.length > 0 ? (
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
    let topGames = <Card fluid raised>
      <Card.Content>
        <Card.Header>
          Most active speedgames
        </Card.Header>
        {topGameFeed}
      </Card.Content>
    </Card>
    return (
      <div className="home">
        <div className="recentEdits">
          {recentEdits}
        </div>
        <div className="followers">
          {followers}
        </div>
        <div className="topGames">
          {topGames}
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
    fetch(`http://localhost:3000/api/v1/followers/${localStorage.getItem("username")}`)
    .then(response=>response.json())
    .then(json=>{
      if (json.success){
        this.setState({
          followers: json.followers
        })
      }
    })
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
