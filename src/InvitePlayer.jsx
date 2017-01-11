import React from 'react';
import Api from './utils/Api.jsx';
import { hashHistory } from 'react-router';

import Page from './Page.jsx';
import InputPair from './InputPair.jsx';

import Utils from './utils/Utils.jsx';

export default class InvitePlayer extends React.Component {
    invite() {
        Api.get('clans/generateInvitationLink?clanId=1013&playerId=3');
    }

    render() {
        return <Page title="Invite Player"><button onClick={this.invite}>Invite</button></Page>;
    }
}
