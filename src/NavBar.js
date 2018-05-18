import React from "react"

class NavBar extends React.Component {
  state = {
    search: ""
  }

  handleChange = e => {
    if(e.key === "Enter"){
      this.search()
    } else if (e.key === "Backspace"){
      this.setState({
        search: this.state.search.slice(0,-1)
      })
    } else {
      this.setState({
        search: this.state.search+e.key
      })
    }
  }

  search = () => {
    fetch("http://localhost:3000/api/v1/games",{
      method: "POST",
      headers: {
       'Content-type':'application/json'
      },
      body: JSON.stringify({
        type: "checkGame",
        title: this.state.search
      })
    })
    .then(response => response.json())
    .then(json => console.log(json))
  }

  render() {
    let logInOrOut = this.props.loggedIn ? <li className="button"><a onClick={this.props.logout} className="button special">Log Out</a></li> : <li className="button special"><a href="/login" className="button special">Sign Up or Log In</a></li>
    let profile = this.props.loggedIn ? <li className="button"><a onClick={() => window.location.href = `http://localhost:3001/users/${localStorage.getItem("username")}`} className="button special">{localStorage.getItem("username")}</a></li> : null
    return (
      <header id="header" className="skel-layers-fixed">
				<h2><a href="/">WikiSpeedia</a></h2>
				<nav id="nav">
					<ul>
						<li><input type="text" placeholder="find a game" value={this.state.search} onKeyDown={this.handleChange}/></li>
						{profile}
						{logInOrOut}
					</ul>
				</nav>
			</header>
    )
  }
}

export default NavBar
