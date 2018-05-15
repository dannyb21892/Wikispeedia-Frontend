import React from "react"

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    stayLoggedIn: false
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
        type: "login",
        username: this.state.username,
        password: this.state.password
      })
    })
    .then(response=>response.json())
    .then(json=>{
      console.log(json)
      if(json.logged_in){

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
      <div>
        <span>LOG IN:</span>
        <form onSubmit={this.handleSubmit}>
          <label>Username</label>
          <input type="text" name="username" value={this.state.username} placeholder="username"  onChange={this.handleChange}/><br/>
          <label>Password</label>
          <input type="password" name="password" value={this.state.password} placeholder="password" onChange={this.handleChange}/><br/>
          <label>Keep Me Logged In</label>
          <input type="checkbox" name="stayLoggedIn" checked={this.state.stayLoggedIn} value={this.state.stayLoggedIn} onChange={this.handleChange}/>
          <input type="submit" />
        </form>
      </div>
    )
  }
}

export default Login
