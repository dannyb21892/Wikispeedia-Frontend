import React from 'react';
import SideNav, { Nav, NavText } from 'react-sidenav';
// https://www.npmjs.com/package/react-sidenav

class Sidebar extends React.Component {

  navigateToArticle = (e) => {
    window.location.href = window.location.href + `/${e.target.id}`
  }

  render() {
    let navs = this.props.info.headings.map((h, i) => {
      let articles = this.props.info.articles[i].map(a => {
          return (
            <Nav key={a.id}>
              <NavText><div id={a.title} onClick={this.navigateToArticle}>{a.title}</div></NavText>
            </Nav>
          )
        }
      )
      return (
          <Nav key={h.id} id={h.name}>
            <NavText> {h.name} </NavText>
            {articles}
          </Nav>
        )
      }
    )
    return (
      <div style={{background: '#2c3e50', color: '#FFF', width: 220}}>
          <SideNav highlightColor='#F5F5F5' highlightBgColor='#00bcd4' defaultSelected='sales'>
            {navs}
          </SideNav>
      </div>
    )
  }
}

export default Sidebar
