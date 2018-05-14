import React from "react"

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    stayLoggedIn: false
  }

  handleChange = e => {
    if (e.target.id === "stayLoggedIn"){
      this.setState({
        stayLoggedIn: !this.state.stayLoggedIn
      })
    } else {
      this.setState({
        [e.target.id]: e.target.value
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
        } else {
          localStorage.removeItem("username")
        }
        this.props.logIn(this.state.username)
      }
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Username</label>
          <input type="text" id="username" value={this.state.username} placeholder="username"  onChange={this.handleChange}/><br/>
          <label>Password</label>
          <input type="password" id="password" value={this.state.password} placeholder="password" onChange={this.handleChange}/><br/>
          <label>Keep Me Logged In</label>
          <input type="checkbox" id="stayLoggedIn" checked={this.state.stayLoggedIn} value={this.state.stayLoggedIn} onChange={this.handleChange}/>
          <input type="submit" />
        </form>
      </div>
    )
  }
}

export default Login
