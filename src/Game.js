import React from "react"

class Game extends React.Component {
  state={
    success: true,
    game: {}
  }

  render() {
    console.log(this.props.match.params.game)
    let gameOrNot = !this.state.success ? <div className="noGame">Sorry, that game could not be found.</div> : (
      <div className="Game">
        <h1>{this.state.game.title}</h1>
        <h5>Released: {this.state.game.release_year}</h5>
      </div>
    )
    return gameOrNot
  }

  // componentWillMount(){
  //   if(this.props.slug === ""){
  //     window.location.href = "http://localhost:3001/games"
  //   }
  // }

  componentDidMount(){
    fetch(`http://localhost:3000/api/v1/games/${this.props.match.params.game}`)
    .then(response=>response.json())
    .then(json=>{
      console.log(json)
      if (json.match){
        this.setState({
          game: json.match
        })
      } else {
        this.setState({
          success: false
        })
      }
    })
  }
}

export default Game
