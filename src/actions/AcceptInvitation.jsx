import React from 'react';
import { Link } from 'react-router';

import Page from '../components/Page.jsx';
import InputPair from '../components/InputPair.jsx';
import BigButton from '../components/BigButton.jsx';

import Api from '../utils/Api.jsx';
import Utils from '../utils/Utils.jsx';

import jwt from 'jwt-simple';
import Session from '../utils/Session';

export default class AcceptInvitation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            clickedWhenNotLoggedIn: false,
            joined: false
        };
        this.joinClan = this.joinClan.bind(this);
    }

    componentDidMount() {
        let token = location.hash.substring('#token='.length);
        var decoded = jwt.decode(token, null, true);
        this.setState({ token, data: decoded ,clickedWhenNotLoggedIn: false, joined: false});
    }

    joinClan() {
        if (!Session.loggedIn()) {
            this.state.clickedWhenNotLoggedIn= true;
            this.setState(this.state);
            return;
        }
        Api.post(`/clans/joinClan?token=${this.state.token}`, (response) => {
            console.log(response);
            if(response.status<=300 && response.status>=200){
                this.state.joined= true;
                this.setState(this.state);
            }
        });
    }

    render() {
        if (this.state.data) {
            return <Page title={'Join Clan'}>
                <div className="well bs-component">
                    {this.state.clickedWhenNotLoggedIn &&
                        <div className="alert alert-danger">
                            <strong>Error!</strong> Please login first and try again...
                        </div>
                    }
                    {this.state.joined &&
                        <div className="alert alert-success">
                            <strong>Hurrah!</strong> You joined...
                        </div>
                    }
                    <InputPair disabled={true} label="Clan Tag" value={this.state.data.clan.tag} />
                    <InputPair disabled={true} label="Clan Name" value={this.state.data.clan.name} />
                    <InputPair disabled={true} label="Expire At" value={Utils.formatTimestamp(this.state.data.expire)} />
                    <div className="grid" style={{ marginTop: '15px' }}>
                        <BigButton disabled={this.state.joined} onClick={this.joinClan} className="col-1-2">Join Clan</BigButton>
                        <Link to={`/clan/${this.state.data.clan.id}`} className="col-1-2 btn btn-default btn-lg">Go to Clan Page</Link>
                    </div>
                </div>
            </Page>;
        }
        return <Page title="Loading..." />;
    }
}
