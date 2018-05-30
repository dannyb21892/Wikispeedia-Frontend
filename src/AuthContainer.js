import React from "react"
import Login from "./Login"
import Logout from "./Logout"
import Signup from "./Signup"
import { Divider } from "semantic-ui-react"

const AuthContainer = props => {
  let loginout = props.loggedIn ? null : <Login hideLogin={props.hideLogin} logIn={props.logIn}/>
  let signup = props.loggedIn ? null : <Signup hideLogin={props.hideLogin} logIn={props.logIn}/>
  return (
    <div className="AuthContainer">
      {loginout}
      {props.loggedIn ? null : <Divider />}
      {signup}
    </div>
  )
}

export default AuthContainer
