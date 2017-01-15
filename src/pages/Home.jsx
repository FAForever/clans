import React from 'react';
import { Link, browserHistory } from 'react-router';

import Page from '../components/Page.jsx';
import Session from '../utils/Session.jsx';

export default class Home extends React.Component {
    componentDidMount() {
        // eslint-disable-next-line no-undef
        $('#header').bgswitcher({
            images: ['/images/spider.jpg', '/images/zar.jpg', '/images/bombers.jpg', '/images/explosion.jpg', '/images/sera.jpg'],
            interval: 5000 + 5000,
            shuffle: true,
            duration: 5000 // Effect duration
        });
        if (location.hash.startsWith('#access_token')) {
            Session.oauth.token.getToken(window.location.href) // TODO: use browser history
                .then(function (token) {
                    Session.registerToken(token.data);
                    browserHistory.push('');
                });
        }
        Session.addListener(() => {
            this.forceUpdate();
        });
    }
    render() {
        return (
            <Page title="Home">
                <div className="jumbotron" id="header">
                    <center>
                        <div className="panel-transparent">
                            <h1>Clan Management</h1>
                            <h2>Forged Alliance Forever</h2>
                        </div>
                        <div className="row" style={{ 'marginTop': '15px' }}>
                            {!Session.getClan() &&
                            <Link to="/action/createClan" className="btn btn-default btn-lg">
                                <i className="fa fa-plus-circle"></i> Create Clan
                                </Link>
                            }
                            {Session.getClan() &&
                                <Link to={`/action/invitePlayer/${Session.getClan().id}`} className="btn btn-default btn-lg">
                                    <i className="fa fa-users"></i> Invite Players
                                </Link>
                            }
                            <a href="https://www.faforever.com/client" className="btn btn-default btn-lg">
                                <i className="fa fa-gamepad"></i> Play Together
                                </a>
                        </div>
                    </center>
                </div>
            </Page>
        );
    }
}
