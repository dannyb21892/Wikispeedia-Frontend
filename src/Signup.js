import React from "react"
import { Input } from 'semantic-ui-react'

class Signup extends React.Component {
  state = {
    username: "",
    password: "",
    stayLoggedIn: true
  }

  handleChange = e => {
    if (e.target.name === "stayLoggedIn"){
      this.setState({
        stayLoggedIn: !this.state.stayLoggedIn
      })
    } else {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    fetch("http://localhost:3000/api/v1/users",{
      method: "POST",
      headers: {
       'Content-type':'application/json'
      },
      body: JSON.stringify({
        type: "signup",
        username: this.state.username,
        password: this.state.password
      })
    })
    .then(response=>response.json())
    .then(json=>{
      console.log(json)
      if(json.logged_in){
        this.props.hideLogin()
        if (this.state.stayLoggedIn) {
          localStorage.setItem("username", this.state.username)
          localStorage.setItem("pd", json.auth)
          localStorage.setItem("auto", true)
        } else {
          localStorage.removeItem("username")
          localStorage.removeItem("pd")
          localStorage.removeItem("auto")
        }
        this.props.logIn(this.state.username)
      }
    })
  }

  render() {
    return (
      <div className="signup">
        <h3>Sign Up:</h3>
        <form onSubmit={this.handleSubmit}>
          <Input type="text" name="username" value={this.state.username} placeholder="username"  onChange={this.handleChange}/><br /><br />
          <Input type="password" name="password" value={this.state.password} placeholder="password" onChange={this.handleChange}/><br />
          <span style={{display: "none"}}>Keep Me Logged In <input type="checkbox" name="stayLoggedIn" checked={this.state.stayLoggedIn} value={this.state.stayLoggedIn} onChange={this.handleChange}/></span><br/>
          <input type="submit" />
        </form>
      </div>
    )
  }
}

export default Signup
