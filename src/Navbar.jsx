import React from 'react';
import { Link } from 'react-router';
import {ToastMessage, ToastContainer} from 'react-toastr'; 

import Session from './utils/Session.jsx';
import Toast from './utils/Toast.jsx';

let ToastMessageFactory = React.createFactory(ToastMessage.animation);

export default class NavBar extends React.Component {
    login() {
        let clientId = '83891c0c-feab-42e1-9ca7-515f94f808ef';
    //let url = 'https://japi.test.faforever.com';
        let url = 'http://localhost:5000';
        let redirect_uri = 'http://localhost:8080';

        window.location = `${url}/oauth/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirect_uri}`;
    }

    componentDidUpdate() {
        Toast.setToast(this.refs.container);
    }

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
            <li><a href="#">My Clan</a></li>
            <li><p className="navbar-text" onClick={this.login.bind(this)}>Login</p></li>
          </ul>
        </div>
        <ToastContainer ref="container"
                  toastMessageFactory={ToastMessageFactory}
                  className="toast-top-center" />
      </div>
    </nav>
        );
    }
}
