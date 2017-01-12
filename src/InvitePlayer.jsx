import React from 'react';
import Api from './utils/Api.jsx';

import Page from './Page.jsx';

import jwt from 'jwt-simple';

export default class InvitePlayer extends React.Component {
    invite() {
        Api.get('clans/generateInvitationLink?clanId=1013&playerId=3', function(response) {
            console.log(response.data.jwtToken);
            var decoded = jwt.decode(response.data.jwtToken, null, true);
            console.log(decoded);
        });
    }

    render() {
        return <Page title="Invite Player"><button onClick={this.invite}>Invite</button></Page>;
    }
}
