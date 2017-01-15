import React from 'react';
import { Link } from 'react-router';

import Page from '../components/Page.jsx';
import InputPair from '../components/InputPair.jsx';
import Api from '../utils/Api.jsx';
import Utils from '../utils/Utils.jsx';

import jwt from 'jwt-simple';

export default class AcceptInvitation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
        this.joinClan = this.joinClan.bind(this);
    }

    componentDidMount() {
        let token = location.hash.substring('#token='.length);
        var decoded = jwt.decode(token, null, true);
        this.setState({token, data: decoded});
    }
    
    joinClan() {
        Api.post(`clans/joinClan?token=${this.state.token}`, (response) => {
            console.log(response);
        });
    }

    render() {
        if (this.state.data) {
            return <Page title={'Join Clan'}>
                    <div className="well bs-component">
                        <InputPair disabled={true} label="Clan Tag" value={this.state.data.clan.tag} />
                        <InputPair disabled={true} label="Clan Name" value={this.state.data.clan.name} />
                        <InputPair disabled={true} label="Expire At" value={Utils.formatTimestamp(this.state.data.expire)} />
                        <div className="grid" style={{marginTop: '15px'}}>
                            <button onClick={this.joinClan} className="col-1-2 btn btn-default btn-lg">Join Clan</button>
                            <Link to={`/clan/${this.state.data.clan.id}`} className="col-1-2 btn btn-default btn-lg">Go to Clan Page</Link>
                        </div>
                    </div>
                </Page>;
        }
        return <Page title="Loading..." />;
    }
}
