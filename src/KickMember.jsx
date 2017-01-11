import React from 'react';
import { Api } from './utils/Api.jsx';
import { hashHistory } from 'react-router';
import axios from 'axios';


import Page from './Page.jsx';
import InputPair from './InputPair.jsx';

import Utils from './utils/Utils.jsx';
import Session from './utils/Session.jsx';


export default class KickMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membership: null
        };
    }

    componentDidMount() {
        Api.one('clan_membership', this.props.params.membershipid).get({ include: 'player,clan' })
            .then(this.setData.bind(this)).catch(error => console.error(error));
    }

    setData(data) {
        this.setState({ membership: data });
    }

    kickMember() {
        axios.post(`http://localhost:5000/clans/kick?membershipId=${this.props.params.membershipid}`,
            null,
            { headers: { Authorization: `Bearer ${Session.getToken()}` } })
            .then(function () {
                hashHistory.goBack();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    renderMembership() {
        console.log(this.state.membership);
        return <div className="well bs-component">
            <InputPair disabled={true} label="Name" value={this.state.membership.player.login} />
            <InputPair disabled={true} label="Joined" value={Utils.formatTimestamp(this.state.membership.createTime)} />
            <div className="row" style={{ 'marginTop': '15px' }}>
                                <div onClick={this.kickMember.bind(this)} className="btn btn-default btn-lg">
                                    Kick Member
                                </div>
                                 <div onClick={hashHistory.goBack}className="btn btn-default btn-lg">
                                   Return to Clanpage
                                </div>
                            </div>
        </div>;
    }

    render() {
        if (this.state.membership) {
            return <Page title={`Kick Member: ${this.state.membership.player.login}`}>{this.renderMembership()}</Page>;
        }
        return <Page title="Loading..." />;
    }
}
