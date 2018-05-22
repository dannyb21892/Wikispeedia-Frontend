import React from "react"
import Sidebar from "./Sidebar"
import Article from "./Article"

class Game extends React.Component {
  state={
    success: true,
    game: {},
    headings: [],
    articles: [],
    newArticle: {title: "", content: "", html_content: ""},
    articleComponent: null
  }

  addArticle = (e) => {
    let heading = e.target.parentNode.innerHTML.replace("<button>+</button>","")
    let game = window.location.href.split("/").splice(-2)
    game = game[1] === "" ? game[0] : game[1]
    let article = <Article editing={true} newArticle={true} heading={heading} match={{params: {game: game, article: null}}}/>
    this.setState({
      articleComponent: article
    })
    // fetch(`http://localhost:3000/api/v1/articles`, {
    //   method: "POST",
    //   headers: {
    //    'Content-type':'application/json'
    //   },
    //   body: JSON.stringify({
    //     type: "newArticle",
    //     title: this.state.search
    //   })
    // })
  }

  render() {
    let gameOrNot = !this.state.success ? <div className="noGame">Sorry, that game could not be found.</div> : (
      <div className="Game">
        <h1>{this.state.game.title}</h1>
        <h5>Released: {this.state.game.release_year}</h5>
        <div style={{width: 250}}>
          <Sidebar info={{game: this.state.game, headings: this.state.headings, articles: this.state.articles}} addArticle={this.addArticle}/>
        </div>
        <div className="main">
          {this.state.articleComponent}
        </div>
      </div>
    )
    return gameOrNot
  }

  componentDidMount(){
    fetch(`http://localhost:3000/api/v1/games/${this.props.match.params.game}`)
    .then(response=>response.json())
    .then(json=>{
      if (json.match){
        this.setState({
          game: json.match,
          headings: json.headings,
          articles: json.articles
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
