import React from 'react';
import { Api } from './utils/Api.jsx';
import { hashHistory } from 'react-router';

import Page from './Page.jsx';
import InputPair from './InputPair.jsx';
import Toast from './utils/Toast.jsx';
import Session from './utils/Session.jsx';

import _ from 'lodash';

export default class TransferLeadership extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clan: null,
            confirmName: ''
        };
    }

    componentDidMount() {
        Api.one('clan', this.props.params.clanid).get({ include: 'memberships,leader,memberships.player' })
            .then(this.setData.bind(this)).catch(error => console.error(error));
    }

    componentDidUpdate() {
        if(Session.getPlayer() && this.props.params.playerid == Session.getPlayer().id) {
            Toast.getContainer().error('You are already the Leader');
        }
    }

    setData(data) {
        console.log(data);
        this.setState({clan: data});
    }

    onNewLeaderChange(event) {
        this.setState({ confirmName: event.target.value });
    }

    transferLeadership() {
        console.log('transferLeadership');
        hashHistory.goBack();
    }

    getNewLeaderName() {
        var playerid = this.props.params.playerid;
        let newLeader = _.find(this.state.clan.memberships, function(m) { 
            return m.player.id == playerid;}.bind(this));
        if(newLeader) {
            return newLeader.player.login;
        }
        Toast.getContainer().error('Is the new leader still a clan member?', 'Cannot find new Leader');
        return null;

    }

    submitDisabled() {
        return this.state.confirmName == '' || this.getNewLeaderName() != this.state.confirmName;
    }

    renderData() {
        return <div>
                    <div className="alert alert-danger" role="alert">
                        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/> This operation is undoable
                    </div>
                    <div className="well bs-component">
                        <p>This operation transfer the leadership of your clanto a new member.</p>
                        <InputPair disabled={true} label="Clan Tag" value={this.state.clan.tag} />
                        <InputPair disabled={true} label="Clan Name" value={this.state.clan.name} />
                        <InputPair disabled={true} label="New Leader" value={this.getNewLeaderName()} />
                        <p/>
                        <p>After the Leadership transfer</p>
                        <ul>
                            <li>You can no longer update the clan</li>
                            <li>You can no longer delete the clan</li>
                            <li>You can no longer invite new Player</li>
                            <li>You can no longer invite kick Player</li>
                        </ul>
                        <p>To confirm this operation please type the name of the new Leader</p>
                        <InputPair label="New Leader" value={this.state.confirmName} onChange={this.onNewLeaderChange.bind(this)} />
                        <p/>
                        <div className="grid">
                            <button disabled={this.submitDisabled()} onClick={this.transferLeadership} className="col-1-2 btn btn-default btn-lg">Transfer Leadership</button>
                            <button onClick={hashHistory.goBack} className="col-1-2 btn btn-default btn-lg">Stay Leader</button>
                        </div>
                    </div>
                </div>;
    }

    render() {
        if (this.state.clan) {
            return <Page title={'Transfer Leadership'}>{this.renderData()}</Page>;
        }
        return <Page title="Loading..." />;
    }
}
