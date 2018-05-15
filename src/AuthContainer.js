import React from "react"
import Login from "./Login"
import Logout from "./Logout"
import Signup from "./Signup"

const AuthContainer = props => {
  let loginout = props.loggedIn ? <Logout logout={props.logout} username={props.username}/> : <Login logIn={props.logIn}/>
  let signup = props.loggedIn ? null : <Signup logIn={props.logIn}/>
  return (
    <div className="AuthContainer">
      {loginout}
      {signup}
    </div>
  )
}

export default AuthContainer
