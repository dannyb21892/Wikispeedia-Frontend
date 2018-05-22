import React from "react"
import MDE from "./MDE"

class Article extends React.Component {
  state={
    editing: this.props.editing || false,
    markdown: "",
    html: "",
    title: ""
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
        type: this.props.newArticle ? "newArticle" : "updateArticle",
        content: mdeState.markdown,
        html_content: mdeState.html,
        game: this.props.match.params.game,
        article: this.props.match.params.article,
        heading: this.props.heading,
        title: this.state.title
      })
    })
    .then(response => response.json())
    .then(json => {
        console.log(json)
        console.log(this.props.match)
        debugger
        window.location.href = window.location.href.split("/").slice(0,5).join("/") + "/" + `${json.title}`
    })
  }

  titleChange = (e) => {
    this.setState({
      title: e.target.value
    })
  }

  render() {
    let show
    if(this.state.editing){
      show = (
        <div>
          <input value={this.state.title} placeholder="Article Title" onChange={this.titleChange} /><br />
          <MDE markdown={this.state.markdown.replace("↵","\n")} submitContent={this.submitContent}/>
        </div>
      )
    } else {
      show = <div><div dangerouslySetInnerHTML={{ __html: this.state.html }} /><button onClick={this.editArticle}>Edit</button></div>
    }
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
    .then(json => {
      if(json.success){
        this.setState({
          markdown: json.markdown,
          html: json.html.replace("↵",""),
          title: json.title
        })
      }
    })
  }
}

export default Article
