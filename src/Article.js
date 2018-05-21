import React from "react"
import MDE from "./MDE"

class Article extends React.Component {
  state={
    editing: false,
    markdown: "",
    html: ""
  }

  editArticle = () => {
    this.setState({
      editing: true
    })
  }

  submitContent = (mdeState) => {
    fetch("http://localhost:3000/api/v1/articles",{
      method: "POST",
      headers: {
       'Content-type':'application/json'
      },
      body: JSON.stringify({
        type: "updateArticle",
        content: mdeState.markdown,
        html_content:  mdeState.html,
        game: this.props.match.params.game,
        article: this.props.match.params.article
      })
    })
    .then(response => response.json())
    .then(json => this.setState({
      markdown: json.markdown,
      html: json.html.replace("↵",""),
      editing: false
    }))
  }

  render() {
    let show = this.state.editing ?
    <div><MDE markdown={this.state.markdown.replace("↵","\n")} submitContent={this.submitContent}/></div> :
    <div><div dangerouslySetInnerHTML={{ __html: this.state.html }} /><button onClick={this.editArticle}>Edit</button></div>

    return show
  }

  componentDidMount(){
    fetch("http://localhost:3000/api/v1/articles",{
      method: "POST",
      headers: {
       'Content-type':'application/json'
      },
      body: JSON.stringify({
        type: "getArticle",
        game: this.props.match.params.game,
        article: this.props.match.params.article
      })
    })
    .then(response => response.json())
    .then(json => this.setState({
      markdown: json.markdown,
      html: json.html.replace("↵","")
    }))
  }
}

export default Article
