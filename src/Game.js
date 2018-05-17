import React from "react"

class Game extends React.Component {
  state={
    title: "",
    headings: []
  }

  render() {
    return this.props.slug
  }

  componentDidMount(){
    fetch(`http://localhost:3000/api/v1/games/${this.props.slug}`)
    .then(response=>response.json())
    .then(json=>console.log(json))
  }
}

export default Game
