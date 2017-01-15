import React from 'react';
import { browserHistory } from 'react-router';

import Page from '../components/Page.jsx';
import InputPair from '../components/InputPair.jsx';
import BigButton from '../components/BigButton.jsx';

import Api from '../utils/Api.jsx';
import Utils from '../utils/Utils.jsx';

export default class KickMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membership: null
        };
    }

    componentDidMount() {
        Api.json().one('clan_membership', this.props.params.membershipid).get({ include: 'player,clan' })
            .then(this.setData.bind(this)).catch(error => console.error(error));
    }

    setData(data) {
        this.setState({ membership: data });
    }

    kickMember() {
        Api.post(`/clans/kick?membershipId=${this.props.params.membershipid}`, function () {
            browserHistory.goBack();
        });
    }

    renderMembership() {
        console.log(this.state.membership);
        return <div className="well bs-component">
            <InputPair disabled={true} label="Name" value={this.state.membership.player.login} />
            <InputPair disabled={true} label="Joined" value={Utils.formatTimestamp(this.state.membership.createTime)} />
            <div className="grid" style={{ 'marginTop': '15px' }}>
                <BigButton onClick={this.kickMember.bind(this)} className="col-1-2">
                    Kick Member
                </BigButton>
                <BigButton onClick={browserHistory.goBack} className="col-1-2">Return to Clanpage</BigButton>
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
