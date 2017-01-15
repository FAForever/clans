import React from 'react';
import { Link } from 'react-router';
import {ToastMessage, ToastContainer} from 'react-toastr'; 

import Session from './utils/Session.jsx';
import Toast from './utils/Toast.jsx';

let ToastMessageFactory = React.createFactory(ToastMessage.animation);

export default class NavBar extends React.Component {
    componentDidUpdate() {
        Toast.setToast(this.refs.container);
    }

    componentDidMount() {
        Session.addListener(function() {
            this.forceUpdate();
        }.bind(this));
    }


    renderUserData() {
        if(Session.getClan()) {
            let clan = Session.getClan();
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
        <ToastContainer ref="container"
                  toastMessageFactory={ToastMessageFactory}
                  className="toast-top-center" />
      </div>
    </nav>
        );
    }
}
