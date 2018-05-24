import React from "react"
import MDE from "./MDE"
import Sidebar from "./Sidebar"

class Article extends React.Component {
  state={
    editing: this.props.editing || false,
    markdown: "",
    html: "",
    title: "",
    headings: [],
    articles: [],
    game: {},
    edits: [{html_content: "", content: "", title: ""}],
    currentEdit: 0
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
        window.location.href = window.location.href.split("/").slice(0,5).join("/") + `/${json.title}`
    })
  }

  titleChange = (e) => {
    this.setState({
      title: e.target.value
    })
  }

  changeCurrentEdit = e => {
    if(e.target.innerText === "<"){
      this.setState({currentEdit: this.state.currentEdit-1})
    } else if (e.target.innerText === ">"){
      this.setState({currentEdit: this.state.currentEdit+1})
    }
  }

  render() {
    console.log(this.state.edits, this.state.currentEdit, this.state.edits[this.state.currentEdit].html_content)
    let show
    let edits=null
    if(this.state.editing){
      show = (
        <div>
          <input value={this.state.title} placeholder="Article Title" onChange={this.titleChange} /><br />
          <MDE markdown={this.state.markdown.replace("↵","\n")} submitContent={this.submitContent}/>
        </div>
      )
    } else {
      edits = <div>View older revisions of this article: <button disabled={this.state.currentEdit === 0} onClick={this.changeCurrentEdit}>{"<"}</button><button disabled={this.state.currentEdit === this.state.edits.length - 1} onClick={this.changeCurrentEdit}>{">"}</button></div>
      show = <div><div dangerouslySetInnerHTML={{ __html: this.state.edits[this.state.currentEdit].html_content }} />{this.props.loggedIn && this.state.edits[this.state.currentEdit].html_content !== "" ? <button onClick={this.editArticle}>Edit</button> : null}</div>
    }
    return (
      <div>
        <div style={{width: 250}}>
          <Sidebar info={{game: this.state.game, headings: this.state.headings, articles: this.state.articles}} addArticle={this.addArticle}/>
        </div>
        <div className="main">
        {edits}
          {show}
        </div>
      </div>
    )
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
          title: json.title,
          headings: json.headings,
          articles: json.articles,
          edits: json.approvedEdits.length > 0 ? json.approvedEdits : [{html_content: json.html.replace("↵",""), content: json.markdown, title: ""}],
          currentEdit: json.approvedEdits.length > 0 ? json.approvedEdits.length-1 : this.state.currentEdit,
          game: json.game
        })
      }
    })
  }
}

export default Article
