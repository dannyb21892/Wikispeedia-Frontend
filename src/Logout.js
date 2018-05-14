import React from "react"

const Logout = props => {
  return (
    <div>
      <p>LOGGED IN AS {props.username}</p>
      <button onClick={props.logout}>Log Out</button>
    </div>
  )
}

export default Logout
