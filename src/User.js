import React from "react"
import { Feed, Divider, Icon, Button } from "semantic-ui-react"

class User extends React.Component {
  state={
    edits: [],
    reallyDelete: false
  }

  deleteAccount=()=>{
    fetch(`http://localhost:3000/api/v1/users/${this.props.match.params.user}`,{
      method: "DELETE"
    })
    .then(response=>response.json())
    .then(json=>{
      if (json.success){
        this.props.logout()
      }
    })
  }

  render(){
    if(this.props.loggedIn && this.props.username === this.props.match.params.user){
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
                  <a href = {e.url}>{e.edit.title}</a><Feed.Date style={{color: "#808389"}}>{e.timestamp}</Feed.Date>
                </Feed.Summary>
                <Feed.Meta style={{color: e.edit.status === "approved" ? "green" : (e.edit.status === "rejected" ? "red" : "grey")}}>
                  Edit is {e.edit.status}
                </Feed.Meta>
              </Feed.Content>
            </Feed.Event>
          )})}
        </Feed>
      ) : "Go write some articles!"
      return (
        <div className="userPageContainer">
          <div className="recentEdits">
            <h3>Your Most Recent Article Revisions</h3>
            <Divider />
            {editFeed}
          </div>
          <div className="userSettingsContainer">
            <h3>Settings</h3>
            <Divider />
            <div style={{margin: 10}}>
              <p>Click this button to completely delete your account. This action CANNOT be undone:</p>
              <Button style={{display: (this.state.reallyDelete ? "none" : "initial")}} inverted color="red" onClick={() => this.setState({reallyDelete: true})}>Delete Account</Button>
              <Button inverted color="red" style={{display: (this.state.reallyDelete ? "initial" : "none")}} onClick={this.deleteAccount}>Actual last chance, click to delete permanently</Button>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="recentEdits">
          <Divider />
            <h3 style={{marginTop: 14}}>You do not have permission to view this page</h3>
          <Divider />
        </div>
      )
    }
  }


  componentDidMount() {
    fetch(`http://localhost:3000/api/v1/edits`,{
      method: "POST",
      headers: {
       'Content-type':'application/json'
      },
      body: JSON.stringify({
        type: "home",
        user: this.props.match.params.user
      })
    })
    .then(response=>response.json())
    .then(json=>{
      this.setState({
        edits: [...json.edits.edits, ...json.edits.home_edits].sort((a,b)=>b.time - a.time)
      })
    })
  }
}

export default User
