import React from 'react';
import { browserHistory } from 'react-router';

import Warning from '../components/Warning.jsx';
import Page from '../components/Page.jsx';
import InputPair from '../components/InputPair.jsx';
import BigButton from '../components/BigButton.jsx';

import Toast from '../utils/Toast.jsx';
import Api from '../utils/Api.jsx';
import Session from '../utils/Session.jsx';

import _ from 'lodash';

export default class LeaveClan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clan: null
        };
        this.leaveClan = this.leaveClan.bind(this);
    }

    componentDidMount() {
        Api.json().one('clan', this.props.params.clanid).get({ include: 'memberships,memberships.player' })
            .then(this.setData.bind(this)).catch(error => console.error(error));
    }

    setData(data) {
        this.setState({ clan: data });
    }

    leaveClan() {
        let player = Session.getPlayer();
        let myMembership = _.find(this.state.clan.memberships, (membership) => {
            return membership.player.id == player.id;
        });
        if (!myMembership) {
            Toast.getContainer().error('You may left allready?', 'You are not in this Clan');
            return;
        }
        // TODO: refresh session
        Api.json().destroy('clanMembership', myMembership.id)
            .then(() =>  browserHistory.goBack())
            .catch(Api.jsonError);
    }

    renderMembership() {
        return <div className="well bs-component">
             <Warning message="You can't revert this operation" />
            <p>Please confirm that you want to leave the following clan:</p>
            <InputPair disabled={true} label="Clan Tag" value={this.state.clan.tag} />
            <InputPair disabled={true} label="Clan Name" value={this.state.clan.name} />
            <div className="grid" style={{ 'marginTop': '15px' }}>
                <BigButton onClick={this.leaveClan} className="col-1-2">
                    Leave Clan
                </BigButton>
                <BigButton onClick={browserHistory.goBack} className="col-1-2">Return to Clanpage</BigButton>
            </div>
        </div>;
    }

    render() {
        if (this.state.clan) {
            return <Page title="Leave Clan">{this.renderMembership()}</Page>;
        }
        return <Page title="Loading..." />;
    }
}
