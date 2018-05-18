import React from "react"

class NavBar extends React.Component {
  render() {
    let logInOrOut = this.props.loggedIn ? <li class="button"><a onClick={this.props.logout} class="button special">Log Out</a></li> : <li class="button special"><a href="/login" class="button special">Sign Up or Log In</a></li>
    return (
      <header id="header" class="skel-layers-fixed">
				<h2><a href="/">WikiSpeedia</a></h2>
				<nav id="nav">
					<ul>
						<li><a href="/">Home</a></li>
						<li><a href="left-sidebar.html">Left Sidebar</a></li>
						<li><a href="right-sidebar.html">Right Sidebar</a></li>
						<li><a href="no-sidebar.html">No Sidebar</a></li>
						{logInOrOut}
					</ul>
				</nav>
			</header>
    )
  }
}

export default NavBar
