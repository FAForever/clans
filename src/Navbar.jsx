import React from 'react';
import { Link } from 'react-router';

import Session from './utils/Session.jsx';

export default class NavBar extends React.Component {

    componentDidMount() {
        Session.addListener(function() {
            this.forceUpdate();
        }.bind(this));
    }


    renderUserData() {
        if(Session.getUser() && Session.getUser().clan) {
            let clan = Session.getUser().clan;
            return <li><Link to={`/clan/${clan.id}`} activeClassName="active">My Clan: {clan.tag}</Link></li>;
        }
    }

    renderLogin() {
        if(Session.loggedIn()) {
            return <li><p className="navbar-text" onClick={Session.logout}>Logout: {Session.getPlayername() || ''}</p></li>;
        }
        return <li><p className="navbar-text" onClick={Session.login}>Login</p></li>;
    }


    render() {
        return (
      <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">
            <img alt="FaF" src="/images/faf_32x32.png"/>
          </a>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
            <li><Link to="/" activeClassName="active">Home</Link></li>
            <li><Link to="/clans" activeClassName="active">Clans</Link></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
             { this.renderUserData() } { this.renderLogin() }
          </ul>
        </div>
      </div>
    </nav>
        );
    }
}
