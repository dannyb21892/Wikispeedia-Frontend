import React from "react"
import Login from "./Login"
import Logout from "./Logout"
import Signup from "./Signup"
import { Divider } from "semantic-ui-react"

const AuthContainer = props => {
  let loginout = props.loggedIn ? <Logout logout={props.logout} username={props.username}/> : <Login logIn={props.logIn}/>
  let signup = props.loggedIn ? null : <Signup logIn={props.logIn}/>
  return (
    <div className="AuthContainer">
      {loginout}
      {props.loggedIn ? null : <Divider />}
      {signup}
    </div>
  )
}

export default AuthContainer
