import React from "react"

class NewGame extends React.Component {
  state={
    title: "",
    year: "",
    currentHeading: "",
    headings: ["General Knowledge", "Game Locations", "Glitches"],
    currentModerator: "",
    moderators: [],
    progress: 1
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addHeading = e => {
    e.preventDefault()
    this.setState({
      headings: [...this.state.headings, this.state.currentHeading]
    })
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
            moderators: [...this.state.moderators, this.state.currentModerator]
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
            moderators: [...this.state.moderators, localStorage.getItem("username")]
          })
        })
        .then(response=>response.json())
        .then(json=>{
          console.log(json)
          if (json.success){
            this.setState({
              progress: this.state.progress + 1
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

        return (<div className="newGameForm">
          <h3>Set up a new wiki!</h3>
          <h3>Step 1 of 3: Choose a Game</h3>
          <form onSubmit={this.handleSubmit}>
            <p>Game Title: <br/> <input type="text" name="title" value={this.state.title} onChange={this.handleChange} /></p>
            <p>Release Year: <br/> <select name="year" options={years} onChange={this.handleChange}>{options}</select></p>
            <input type="submit" />
          </form>
        </div>)
      case 2:
        let headings = this.state.headings.map(heading=><li key={heading} id={heading} onClick={this.remHeading}>{heading}</li>)
        return (
        <div>
          <h3>Set up a new wiki!</h3>
          <h3>Step 2 of 3: Add Article Headings</h3>
          <p>These will be the highest level groupings of related articles. Some defaults have been provided. Click "+" to add your own, or click a heading tag to remove it.</p>
          <form onSubmit={this.handleSubmit}>
            <input type="text" name="currentHeading" value={this.state.currentHeading} onChange={this.handleChange} />
            <button onClick={this.addHeading}>+</button>
            <input type="submit" />
            <ul>
              {headings}
            </ul>
          </form>
        </div>)
      case 3:
        let moderators = this.state.moderators.map(moderator=><li key={moderator} id={moderator} onClick={this.remMod}>{moderator}</li>)
        return (
          <div>
            <h3>Set up a new wiki!</h3>
            <h3>Step 3 of 3: Add Moderators</h3>
            <p>Your moderators will be responsible for approving any edits made to the articles in your wiki. You are already a moderator of any wiki you create.</p>
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="currentModerator" value={this.state.currentModerator} onChange={this.handleChange} />
              <button onClick={this.addMod}>+</button>
              <input type="submit" />
              <ul>
                {moderators}
              </ul>
            </form>
          </div>
        )
      case 4:
        moderators = this.state.moderators.map(moderator=><li key={moderator} id={moderator}>{moderator}</li>)
        headings = this.state.headings.map(heading=><li key={heading} id={heading}>{heading}</li>)
        return (
          <div>
            <h3>Your wiki has been successfully created!</h3>
            <span><strong>Game title: </strong>{this.state.title}</span><br/>
            <span><strong>Released: </strong>{this.state.year}</span><br/>
            <span><strong>Article Headings: </strong><ul>{headings}</ul></span><br/>
            <span><strong>Moderators: </strong><ul>{moderators}</ul></span>
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
        {whichSection}
      </div>
    )
  }
}

export default NewGame
