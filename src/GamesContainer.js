import React from "react"
import { Link } from "react-router-dom"

class GamesContainer extends React.Component {
  state = {
    games: []
  }

  render(){
    let games = this.state.games.map(game=><li key={game.slug}><Link to={"/games/"+game.slug}>{game.title}</Link></li>)
    return games
  }

  componentDidMount(){
    fetch(`http://localhost:3000/api/v1/games`)
    .then(response=>response.json())
    .then(json=>{
      console.log(json)
      this.setState({
        games: json.games
      })
    })
  }
}

export default GamesContainer
