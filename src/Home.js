import React from "react"
import { Card, Icon, Image, Feed } from 'semantic-ui-react'
import edit from "./assets/edit.png"

class Home extends React.Component {
  state = {
    edits: []
  }

  render(){
    let n = this.state.edits
    let nheader = "Discover recently updated articles"
    let feed = n.length > 0 ? (
      <Feed>
        {n.map((e,i) => {
          return (
          <Feed.Event key={i}>
            <Feed.Label image={edit} />
            <Feed.Content>
              <Feed.Summary>
                <a>{e.title}</a>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        )})}
      </Feed>
    ) : null
    let notifications = (
      <Card.Content>
        <Card.Header>
          {nheader}
        </Card.Header>
        {feed}
      </Card.Content>
    )
    return (
      <div className="home recentEdits">
        <Card fluid raised>
          {notifications}
        </Card>
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
  }
}
 export default Home
