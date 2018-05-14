import React from "react"

class Login extends React.Component {
  state = {
    username: "",
    password: ""
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
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
        this.setState({
          username: "",
          password: ""
        })
        this.props.logIn()
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
          <input type="submit" />
        </form>
      </div>
    )
  }
}

export default Login
