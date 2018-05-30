import React from "react"
import { Link } from 'react-router-dom'
import { Step, Divider, Button, List } from "semantic-ui-react"

class NewGame extends React.Component {
  state={
    title: "",
    year: "",
    currentHeading: "",
    headings: ["General Knowledge", "Game Locations", "Glitches"],
    currentModerator: "",
    moderators: [],
    slug: "",
    progress: 1
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addHeading = e => {
    e.preventDefault()
    if(!this.state.headings.map(h=>h.toLowerCase()).includes(this.state.currentHeading.toLowerCase())){
      this.setState({
        headings: [...this.state.headings, this.state.currentHeading],
        currentHeading: ""
      })
    }
  }

  remHeading = e => {
    let index = this.state.headings.findIndex(heading=>heading === e.target.id)
    this.setState({
      headings: [...this.state.headings.slice(0,index), ...this.state.headings.slice(index+1)]
    })
  }

  addMod = e => {
    e.preventDefault()
    fetch("http://localhost:3000/api/v1/users",{
      method: "POST",
      headers: {
       'Content-type':'application/json'
      },
      body: JSON.stringify({
        type: "checkUser",
        username: this.state.currentModerator
      })
    })
    .then(response=>response.json())
    .then(json=>{
      console.log(json)
      if(json.userExists) {
        if(json.username === localStorage.getItem("username")) {
          console.log("You are already a moderator of the wiki you are making")
        } else {
          this.setState({
            moderators: [...this.state.moderators, this.state.currentModerator],
            currentModerator: ""
          })
        }
      }
    })
  }

  remMod = e => {
    let index = this.state.moderators.findIndex(moderator=>moderator === e.target.id)
    this.setState({
      moderators: [...this.state.moderators.slice(0,index), ...this.state.moderators.slice(index+1)]
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    switch (this.state.progress) {
      case 1: //Check game vs backend to make sure it doesnt already exist
        fetch("http://localhost:3000/api/v1/games",{
          method: "POST",
          headers: {
           'Content-type':'application/json'
          },
          body: JSON.stringify({
            type: "checkGame",
            title: this.state.title,
            year: this.state.year
          })
        })
        .then(response=>response.json())
        .then(json=>{
          console.log(json)
          if(!json.gameAlreadyExists) {
            this.setState({
              progress: this.state.progress + 1
            })
          } else {
            console.log("Game already exists in database") //eventually lead user to existing game page
          }
        })
        break;
      case 2:
        console.log("setting 2 to 3")
        this.setState({
          progress: this.state.progress + 1
        })
        break;
      case 3:
        let slug = this.state.title.replace(/[!@#$%^&*()+={}|[\]\\;'"`~:<>?,./]/g,"").replace(/[-]/g,"_").replace(/\s/g,"_")
        fetch("http://localhost:3000/api/v1/games",{
          method: "POST",
          headers: {
           'Content-type':'application/json'
          },
          body: JSON.stringify({
            type: "createGame",
            title: this.state.title,
            year: this.state.year,
            headings: this.state.headings,
            moderators: [...this.state.moderators, localStorage.getItem("username")],
            slug: slug
          })
        })
        .then(response=>response.json())
        .then(json=>{
          console.log(json)
          if (json.success){
            this.setState({
              progress: this.state.progress + 1,
              slug: json.game.slug.name
            })
          }
        })
        break;
      default:
    }
  }

  getNewGameSection = () => {
    switch (this.state.progress) {

      case 1:
        let d = new Date()
        let currentYear = d.getFullYear()
        let years = Array.from(new Array(currentYear-1959), (x,i) => 2018-i)
        let options = years.map(year => <option key={year} value={year}>{year}</option>)

        return (
          <div className="newGameForm">
            <h2>Set up a new wiki!</h2>
            <h3>Step 1 of 3: Choose a Game</h3>
            <form onSubmit={this.handleSubmit}>
              <p>Game Title: <br/> <input type="text" name="title" value={this.state.title} onChange={this.handleChange} /></p>
              <p>Release Year: <br/> <select name="year" options={years} onChange={this.handleChange}>{options}</select></p>
              <input type="submit" />
            </form>
          </div>)
      case 2:
        let headings = this.state.headings.map(heading=><div className={"newGameHeading"}><Button fluid inverted icon="remove" key={heading} id={heading} onClick={this.remHeading}>{heading}</Button></div>)
        return (
        <div className="newGameForm">
          <h3>Set up a new wiki!</h3>
          <h3>Step 2 of 3: Add Article Headings</h3>
          <p>These will be the highest level groupings of related articles. Some defaults have been provided. Click "+" to add your own, or click a heading tag to remove it.</p>
          <form onSubmit={this.handleSubmit} style={{margin: 10}}>
            <input type="text" name="currentHeading" value={this.state.currentHeading} onChange={this.handleChange} />
            <button onClick={this.addHeading}>+</button>
            <input type="submit" /><br />
          </form>
          <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
            {headings}
          </div>
        </div>)
      case 3:
        let moderators = this.state.moderators.map(moderator=><div className={"newGameHeading"}><Button fluid inverted icon="remove" key={moderator} id={moderator} onClick={this.remMod}>{moderator}</Button></div>)
        return (
          <div className="newGameForm">
            <h3>Set up a new wiki!</h3>
            <h3>Step 3 of 3: Add Moderators</h3>
            <p>Your moderators will be responsible for approving any edits made to the articles in your wiki. You are already a moderator of any wiki you create.</p>
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="currentModerator" value={this.state.currentModerator} onChange={this.handleChange} />
              <button onClick={this.addMod}>+</button>
              <input type="submit" />
            </form>
            <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
              {moderators}
            </div>
          </div>
        )
      case 4:
        moderators = [...this.state.moderators, localStorage.getItem("username")].map(moderator=><List.Item key={moderator} id={moderator}><List.Content><List.Header>{moderator}</List.Header></List.Content></List.Item>)
        headings = this.state.headings.map(heading=><List.Item key={heading} id={heading}><List.Content><List.Header>{heading}</List.Header></List.Content></List.Item>)
        let link = this.props.URL+"games/"+this.state.slug
        let linkto = "games/"+this.state.slug
        return (
          <div className="newGameForm">
            <h2>Your wiki has been successfully created!</h2>
            <h3>Game title: {this.state.title}</h3><br/>
            <span><strong>Released: </strong>{this.state.year}</span><br/>
            <div style={{display: "flex", flexDirection: "row", justifyContent:"center"}}>
              <div style={{display: "flex", flexDirection: "column", flexGrow: 0, marginRight: 30}}><h4>Article Headings: </h4><List divided inverted relaxed>{headings}</List></div>
              <div style={{display: "flex", flexDirection: "column", flexGrow: 0, marginLeft: 30}}><h4>Moderators: </h4><List divided inverted relaxed>{moderators}</List></div>
            </div><br /><br />
            <span>Your game can be found at the following link: <Link to={linkto}>{link}</Link></span>
          </div>
        )
      default:

    }
  }

  componentDidMount(){
    let d = new Date()
    let currentYear = d.getFullYear()
    this.setState({
      year: `${currentYear}`
    })
  }

  render() {
    let whichSection = this.props.loggedIn ? this.getNewGameSection() : "You must be logged in to start new Wikis!"
    return (
      <div className="newGameContainer">
        <Step.Group ordered>
          <Step completed={this.state.progress > 1} active={this.state.progress === 1}>
            <Step.Content>
              <Step.Title>Choose Game</Step.Title>
            </Step.Content>
          </Step>

          <Step completed={this.state.progress > 2} active={this.state.progress === 2}>
            <Step.Content>
              <Step.Title>Add Headings</Step.Title>
            </Step.Content>
          </Step>

          <Step completed={this.state.progress > 3} active={this.state.progress === 3}>
            <Step.Content>
              <Step.Title>Add Moderators</Step.Title>
            </Step.Content>
          </Step>
        </Step.Group>
        <Divider />
        {whichSection}
      </div>
    )
  }
}

export default NewGame
