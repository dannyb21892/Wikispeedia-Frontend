import React from 'react';

class Sidebar extends React.Component {
  state = {
    classname: {}
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
    if (window.location.href.slice(-1) === "/"){
      window.location.href = window.location.href.split("/").slice(0,5).join("/") + e.target.innerHTML
    } else {
      window.location.href = window.location.href.split("/").slice(0,5).join("/") + "/" + e.target.innerHTML
    }
  }

  render() {
    if (Object.keys(this.state.classname).length === 0 && this.props.info.headings.length > 0) {this.setHeadings()}
    let navs = this.props.info.headings.map((h, i) => {
      let articles = this.props.info.articles[i].map(a => {
        return (
            <li className="sidenav-li" onClick={this.openArticle} key={a.id}>{a.title}</li>
          )
        }
      )
      return (
          <div className="sidenav-menu" key={h.id}>
              <a name={`${i}`} onClick={this.toggleClass}>{h.name}<button onClick={this.props.addArticle}>+</button></a>
              <ul className ={this.state.classname[`${i}`]}>
                {articles}
              </ul>
          </div>
        )
      }
    )
    return (
      <div className ="sidenav-wrapper">
        {navs}
      </div>
    )
  }

}

export default Sidebar

// let navs = this.props.info.headings.map((h, i) => {
// let articles = this.props.info.articles[i].map(a => {
//       return (
//         <Nav key={a.id} style={{width:"100%", borderStyle:"solid", borderWidth:"5px", borderColor:"black"}}>
//           <NavText><div id={a.title} onClick={this.navigateToArticle}>{a.title}</div></NavText>
//         </Nav>
//       )
//     }
//   )
//   return (
//       <Nav key={h.id} id={h.name} style={{position:"absolute", borderStyle:"solid", borderWidth:"5px", borderColor:"black"}}>
//         <NavText> {h.name} </NavText>
//         {articles}
//       </Nav>
//     )
//   }
// )
// return (
//   <div style={{background: '#2c3e50', color: '#FFF', width: "100%"}}>
//       <SideNav highlightColor='#F5F5F5' highlightBgColor='#00bcd4' defaultSelected='sales'>
//         {navs}
//       </SideNav>
//   </div>
// }
