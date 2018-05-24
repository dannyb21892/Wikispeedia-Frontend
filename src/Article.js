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
    allEdits: [{html_content: "", content: "", title: "", status: ""}],
    currentEditMods: 0,
    currentEditPlebs: 0,
    moderator: false,
    showEdits: false,
    gotContents: false
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
        title: this.state.title,
        moderator: this.state.moderator
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
      this.setState({currentEditMods: this.state.currentEditMods-1})
    } else if (e.target.innerText === ">"){
      this.setState({currentEditMods: this.state.currentEditMods+1})
    }
  }

  approveOrRejectEdit = (type) => {
    fetch(`http://localhost:3000/api/v1/articles/${this.state.allEdits[this.state.currentEditMods].id}`,{
      method: "PATCH",
      headers: {
       'Content-type':'application/json'
      },
      body: JSON.stringify({
        type: type,
      })
    })
    .then(response => response.json())
    .then(json => {
        window.location.href = window.location.href.split("/").slice(0,5).join("/") + `/${json.edit.title}`
    })
  }

  render() {
    let show
    let showEditsOrNot = null
    let edits=null
    if(this.state.editing){
      show = (
        <div>
          <input value={this.state.title} placeholder="Article Title" onChange={this.titleChange} /><br />
          <MDE markdown={this.state.markdown.replace("↵","\n")} submitContent={this.submitContent}/>
        </div>
      )
    } else {
      showEditsOrNot = this.state.moderator ? <button onClick={() => this.setState({showEdits: !this.state.showEdits})}>{this.state.showEdits ? "View latest approved revision" : "View old revisions or approve new ones"}</button> : null
      edits = <div>Scroll between revisions of this article:
                <button disabled={this.state.currentEditMods === 0} onClick={this.changeCurrentEdit}>{"<"}</button><button disabled={this.state.currentEditMods === this.state.allEdits.length - 1} onClick={this.changeCurrentEdit}>{">"}</button><br />
                <span>This article revision is {this.state.allEdits[this.state.currentEditMods].status === "pending" ? this.state.allEdits[this.state.currentEditMods].status + " moderator action" : "already " + this.state.allEdits[this.state.currentEditMods].status}</span>
              </div>
      show = <div>
              <div dangerouslySetInnerHTML={{ __html: this.state.edits[this.state.currentEditPlebs].html_content }} />
              {this.props.loggedIn && this.state.edits[this.state.currentEditPlebs].html_content !== "" && this.state.currentEditPlebs === this.state.edits.length-1 && !this.state.showEdits ? <button onClick={this.editArticle}>Edit</button> : null}
              {this.state.moderator && this.state.showEdits ? (
                <div>
                  {this.state.allEdits[this.state.currentEditMods].status === "pending" || this.state.allEdits[this.state.currentEditMods].status === "denied" ? <button onClick={() => this.approveOrRejectEdit("approve")}>Approve this revision</button> : null}
                  {this.state.allEdits[this.state.currentEditMods].status === "pending" || this.state.allEdits[this.state.currentEditMods].status === "approved" ? <button onClick={()=> this.approveOrRejectEdit("reject")}>Reject this revision</button> : null}
                </div>
              ) : null}
            </div>
    }
    return (
      <div>
        <div style={{width: 250}}>
          <Sidebar info={{game: this.state.game, headings: this.state.headings, articles: this.state.articles}} addArticle={this.addArticle}/>
        </div>
        <div className="main">
          {showEditsOrNot}
          {this.state.showEdits ? edits : null}
          {show}
        </div>
      </div>
    )
  }

  componentDidUpdate(){
    if(!this.state.gotContents){
      let user = this.props.loggedIn ? localStorage.getItem("username") : null
      fetch("http://localhost:3000/api/v1/articles",{
        method: "POST",
        headers: {
         'Content-type':'application/json'
        },
        body: JSON.stringify({
          type: "getArticle",
          game: this.props.match.params.game,
          article: this.props.match.params.article,
          username: user
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
            allEdits: json.all_edits,
            currentEditMods: json.all_edits.length > 0 ? json.all_edits.length-1 : this.state.currentEditMods,
            currentEditPlebs: json.approvedEdits.length > 0 ? json.approvedEdits.length-1 : this.state.currentEditPlebs,
            game: json.game,
            moderator: json.moderator,
            gotContents: true,
          })
        }
      })
    }
  }
}

export default Article
