import React from 'react';

class Sidebar extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      classname: {},
      expanded: {},
      updated: false
    }
  }


  setHeadings = () => {
    let classnames = {}
    this.props.info.headings.forEach((h,i) => {
      classnames[`${i}`] = "sidenav-list"
    })
    this.setState({classname: classnames})
  }

  navigateToArticle = (e) => {
    window.location.href = window.location.href + `/${e.target.id}`
  }

  toggleClass = (e) => {
    let value = (this.state.classname[e.target.name] === "active") ? "sidenav-list" : "active"
    this.setState({
      classname: {...this.state.classname, [e.target.name]: value}
    })
  }

  openArticle = (e) => {
    let slug = e.target.innerHTML.replace(/[!@#$%^&*()+={}|[\]\\;'"`~:<>?,./]/g,"").replace(/[-]/g,"_").replace(/\s/g,"_")
    window.location.href = window.location.href.split("/").slice(0,5).join("/") + "/" + slug
  }

  expand = (e,i) => {
    this.setState({
      expanded: {...this.state.expanded, [i]: !this.state.expanded[i]}
    })
  }

  render() {
    let cards = this.props.info.headings.map((h,i) => {
      let headerType = ""
      if(i===0){headerType = " first"}else if(i===this.props.info.headings.length-1){headerType = " last"}
      let articles = this.props.info.articles[i].map((a,ii) => {
        let articleType=""
        if(ii!==this.props.info.articles[i].length-1){articleType=" notLast"}
        return (
            <div key={ii} className={"article"+articleType+(this.state.expanded[i] ? " expanded" : "")}>
              <a className={a.title.replace(/[!@#$%^&*()+={}|[\]\\;'"`~:<>?,./]/g,"").replace(/[-]/g,"_").replace(/\s/g,"_").toLowerCase() === window.location.href.split("/")[5].toLowerCase() ? "selected" : "notSelected"} onClick={this.openArticle} key={a.id}>{a.title}</a>
            </div>
          )
        }
      )
      articles = [...articles, <div className={"article"+(this.state.expanded[i] ? " expanded" : "")}>
        <a className={"notSelected"} onClick={(e) => this.props.addArticle(e, this.props.info.headings[i])}>{"+ New Article"}</a>
      </div>]

      return  <div>
                  <div key={i} name={i} className={"navHeader"+headerType} onClick={(e) => this.expand(e,i)}>
                    <h4 name={i}>{h.name}</h4>
                  </div>
                {articles}
              </div>
    })
    return (
          cards
    )
  }
  componentDidUpdate() {
    if(!this.state.updated && this.props.info.headings.length > 0){
      let expanded = {}
      this.props.info.headings.forEach((h,i)=>{
        let articles = this.props.info.articles[i].map(a => a.title.replace(/[!@#$%^&*()+={}|[\]\\;'"`~:<>?,./]/g,"").replace(/[-]/g,"_").replace(/\s/g,"_"))
        expanded[i] = articles[i] ? articles[i].toLowerCase() === window.location.href.split("/")[5].toLowerCase() : false
      })
      this.setState({
        expanded: expanded,
        updated: true
      })
    }
  }
}

export default Sidebar

// if (Object.keys(this.state.classname).length === 0 && this.props.info.headings.length > 0) {this.setHeadings()}
// let navs = this.props.info.headings.map((h, i) => {
//   let articles = this.props.info.articles[i].map(a => {
//     return (
//         <li className="sidenav-li" onClick={this.openArticle} key={a.id}>{a.title}</li>
//       )
//     }
//   )
//   return (
//       <div className="sidenav-menu" key={h.id}>
//           <a name={`${i}`} onClick={this.toggleClass}>{h.name}<button onClick={this.props.addArticle}>+</button></a>
//           <ul className ={this.state.classname[`${i}`]}>
//             {articles}
//           </ul>
//       </div>
//     )
//   }
// )
// return (
//   <div className ="sidenav-wrapper">
//     {navs}
//   </div>
// )
