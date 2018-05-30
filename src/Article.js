import React from "react"
import MDE from "./MDE"
import Sidebar from "./Sidebar"
import { Button, Divider } from "semantic-ui-react"
// import { Input } from "semantic-ui-react"

class Article extends React.Component {
  state={
    editing: this.props.editing || false,
    markdown: "",
    newContent: "",
    html: "",
    title: "",
    headings: [],
    heading: "",
    articles: [],
    game: {},
    newArticle: this.props.newArticle,
    edits: [{html_content: "", content: "", title: ""}],
    allEdits: [{html_content: "", content: "", title: "", status: ""}],
    currentEditMods: 0,
    currentEditPlebs: 0,
    follower: false,
    moderator: false,
    showEdits: false,
    gotContents: false,
    noArticle: false,
    home_edits: false
  }

  editArticle = () => {
    this.setState({
      editing: true,
      newArticle: false
    })
  }

  addArticle = (e, heading) => {
    this.setState({
      editing: true,
      newArticle: true,
      heading: heading.name,
      newContent: ""
    })
  }

  submitContent = (mdeState) => {
    let slug = this.state.title.replace(/[!@#$%^&*()+={}|[\]\\;'"`~:<>?,./]/g,"").replace(/[-]/g,"_").replace(/\s/g,"_")
    if(this.state.title !== ""){
      fetch("http://localhost:3000/api/v1/articles",{
        method: "POST",
        headers: {
         'Content-type':'application/json'
        },
        body: JSON.stringify({
          type: this.state.newArticle ? "newArticle" : "updateArticle",
          content: mdeState.markdown,
          html_content: mdeState.html,
          game: this.props.match.params.game,
          article: this.props.match.params.article,
          heading: this.state.heading,
          title: this.state.title,
          moderator: this.state.moderator,
          user: localStorage.getItem("username"),
          slug: slug,
          home: this.state.home,
        })
      })
      .then(response => response.json())
      .then(json => {
          window.location.href = window.location.href.split("/").slice(0,5).join("/") + `/${json.slug}`
      })
    }
  }

  titleChange = (e) => {
    this.setState({
      title: e.target.value
    })
  }

  changeCurrentEdit = e => {
    if(e.target.innerText === "< Earlier Revision"){
      this.setState({currentEditMods: this.state.currentEditMods-1})
    } else if (e.target.innerText === "Later Revision >"){
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
        window.location.href = window.location.href.split("/").slice(0,5).join("/") + `/${json.edit.title.replace(/[!@#$%^&*()+={}|[\]\\;'"`~:<>?,./]/g,"").replace(/[-]/g,"_").replace(/\s/g,"_")}`
    })
  }

  followToggle = (type) => {
    let user = this.props.loggedIn ? localStorage.getItem("username") : null
    fetch("http://localhost:3000/api/v1/followers",{
      method: "POST",
      headers: {
       'Content-type':'application/json'
      },
      body: JSON.stringify({
        type: type ? "addFollower" : "remFollower",
        game: this.state.game.id,
        username: user
      })
    })
    .then(response => response.json())
    .then(json => {
      if(json.success){
        this.setState({
          follower: !this.state.follower
        })
      }
    })
  }

  render() {
    let show
    let showEditsOrNot = null
    let edits=null
    if(this.state.editing){
      let title = this.state.home ? "home" : this.state.title
      let titleDisplay = this.state.home ? "none" : "auto"
      if(this.state.newArticle){
        title = ""
        titleDisplay = "auto"
      }
      show = (
        <div>
          <input value={title} style={{display: titleDisplay}} placeholder="Article Title" onChange={this.titleChange} /><br />
          <MDE markdown={this.state.newArticle ? this.state.newContent : this.state.markdown.replace("↵","\n")} submitContent={this.submitContent}/>
        </div>
      )
    } else {
        if (!this.state.noArticle){
          showEditsOrNot = this.state.moderator ? <Button size="small" inverted onClick={() => this.setState({showEdits: !this.state.showEdits})}>{this.state.showEdits ? "View latest approved revision" : "View old revisions or approve new ones"}</Button> : null
        }
        edits = <div>
                  <Button size="tiny" attached="left" disabled={this.state.currentEditMods === 0} onClick={this.changeCurrentEdit}>{"< Earlier Revision"}</Button><Button size="tiny" attached="right" disabled={this.state.currentEditMods === this.state.allEdits.length - 1} onClick={this.changeCurrentEdit}>{"Later Revision >"}</Button><br />
                  <span>This article revision is {this.state.allEdits[this.state.currentEditMods].status === "pending" ? this.state.allEdits[this.state.currentEditMods].status + " moderator action" : "already " + this.state.allEdits[this.state.currentEditMods].status}</span>
                  <Divider />
                </div>
        let editButton = this.props.loggedIn && !this.state.noArticle && this.state.gotContents && !this.state.editing && !this.state.showEdits ? <Button size="small" inverted onClick={this.editArticle}>Edit</Button> : null
        let articleNotFound = (
          <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", justifyContent: "center"}}>
              <h2>No article by that name found</h2>
            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
              Click "+ New Article" under a sidebar heading to write one!
            </div>
          </div>
        )
        if (this.state.noArticle) {
          show = articleNotFound
        } else {
          let articleContent = null
          if(this.state.showEdits){
            articleContent = this.state.allEdits[this.state.currentEditMods].html_content
          } else {
            if (this.state.edits[this.state.currentEditPlebs].html_content === "") {
              articleContent = "<p>This article has no content yet!  " + (this.props.loggedIn ? "Click the Edit button below" : "Log in")  + " to add some.</p>"
            } else {
              articleContent = this.state.edits[this.state.currentEditPlebs].html_content
            }
          }
          show = <div>
                  <div dangerouslySetInnerHTML={{ __html: articleContent}} />
                  <Divider />
                  {editButton}
                  {this.state.moderator && this.state.showEdits ? (
                    <div>

                      {this.state.allEdits[this.state.currentEditMods].status === "pending" || this.state.allEdits[this.state.currentEditMods].status === "rejected" ? <Button positive onClick={() => this.approveOrRejectEdit("approved")}>Approve this revision</Button> : null}
                      {this.state.allEdits[this.state.currentEditMods].status === "pending" || this.state.allEdits[this.state.currentEditMods].status === "approved" ? <Button negative onClick={()=> this.approveOrRejectEdit("rejected")}>Reject this revision</Button> : null}
                    </div>
                  ) : null}
                </div>
        }
    }

    let follow = null
    if (this.props.loggedIn){
      if (this.state.follower){
        follow = <Button inverted color="red" onClick={() => this.followToggle(false)}>Unfollow this game</Button>
      } else {
        follow = <Button inverted color="green" onClick={() => this.followToggle(true)}>Follow for edit notifications</Button>
      }
    }

    return (
      <div className="contentWrapper">
        <div className="sidebarAndGame">
          <div className="gameWrapper">
            <h1><a href={`${window.location.href.split("/").slice(0,5).join("/")}/home`}>{this.state.game.title}</a></h1>
            <p>Released: {this.state.game.release_year}</p>
            {follow}
          </div>
          <div className="sidebarWrapper">
            <Sidebar info={{game: this.state.game, headings: this.state.headings, articles: this.state.articles}} addArticle={this.addArticle}/>
          </div>
        </div>
        <div className="main">
          {this.state.showEdits ? edits : null}
          {show}
          <br />
          {showEditsOrNot}
        </div>
      </div>
    )
  }

  componentDidMount(){
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
            title: json.home ? "home" : json.title,
            headings: json.headings,
            heading: json.heading,
            articles: json.articles,
            edits: json.approvedEdits.length > 0 ? json.approvedEdits : [{html_content: json.html.replace("↵",""), content: json.markdown, title: ""}],
            allEdits: json.all_edits,
            currentEditMods: json.all_edits.length > 0 ? json.all_edits.length-1 : this.state.currentEditMods,
            currentEditPlebs: json.approvedEdits.length > 0 ? json.approvedEdits.length-1 : this.state.currentEditPlebs,
            game: json.game,
            moderator: json.moderator,
            follower: json.follower,
            gotContents: true,
            home: json.home
          })
        } else {
          this.setState({
            headings: json.headings,
            articles: json.articles,
            game: json.game,
            moderator: json.moderator,
            follower: json.follower,
            gotContents: true,
            noArticle: true,
          })
        }
      })
    }
  }
}

export default Article
