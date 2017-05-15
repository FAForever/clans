import React from 'react';
import { browserHistory } from 'react-router';

import Warning from '../components/Warning.jsx';
import Page from '../components/Page.jsx';
import BigButton from '../components/BigButton.jsx';
import InputPair from '../components/InputPair.jsx';

import Api from '../utils/Api.jsx';
import Toast from '../utils/Toast.jsx';
import Session from '../utils/Session.jsx';

import _ from 'lodash';

export default class TransferLeadership extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clan: null,
            confirmName: ''
        };
        this.getNewLeader = this.getNewLeader.bind(this);
        this.getNewLeaderName = this.getNewLeaderName.bind(this);
    }

    componentDidMount() {
        Api.json().one('clan', this.props.params.clanid).get({ include: 'memberships,leader,memberships.player' })
            .then(this.setData.bind(this)).catch(error => console.error(error));
    }

    componentDidUpdate() {
        if (this.state.clan && Session.getPlayer() && this.state.clan.leader.id != Session.getPlayer().id) {
            Toast.getContainer().error('You are not the Clan Leader');
        }
    }

    setData(data) {
        this.setState({ clan: data });
    }

    onNewLeaderChange(event) {
        this.setState({ confirmName: event.target.value });
    }

    transferLeadership() {
        Api.json().update('clan', {
            id: this.state.clan.id,
            leader: this.getNewLeader()
        }).then(() => {
            browserHistory.goBack();
        }).catch((error) => {
            console.error(error);
        });
    }

    getNewLeader() {
        var newleaderid = this.props.params.newleaderid;
        let newLeader = _.find(this.state.clan.memberships, (membership) => {
            return membership.player.id == newleaderid;
        });
        if (newLeader) {
            return newLeader.player;
        }
        Toast.getContainer().error('Is the new leader still a clan member?', 'Cannot find new Leader');
        return null;
    }

    getNewLeaderName() {
        if (this.getNewLeader()) {
            return this.getNewLeader().login;
        }
        return null;
    }

    submitDisabled() {
        return this.state.confirmName == '' || this.getNewLeaderName() != this.state.confirmName;
    }

    renderData() {
        return <div>
            <Warning message="You can't revert this operation" />
            <div className="well bs-component">
                <p>This operation transfer the leadership of your clanto a new member.</p>
                <InputPair disabled={true} label="Clan Tag" value={this.state.clan.tag} />
                <InputPair disabled={true} label="Clan Name" value={this.state.clan.name} />
                <InputPair disabled={true} label="New Leader" value={this.getNewLeaderName()} />
                <p />
                <p>After the Leadership transfer</p>
                <ul>
                    <li>You can no longer update the clan</li>
                    <li>You can no longer delete the clan</li>
                    <li>You can no longer invite new Player</li>
                    <li>You can no longer invite kick Player</li>
                </ul>
                <p>To confirm this operation please type the name of the new Leader</p>
                <InputPair label="New Leader" value={this.state.confirmName} onChange={this.onNewLeaderChange.bind(this)} />
                <p />
                <div className="grid">
                    <BigButton disabled={this.submitDisabled()}
                        onClick={this.transferLeadership.bind(this)}
                        className="col-1-2">Transfer Leadership</BigButton>
                    <BigButton
                        onClick={browserHistory.goBack}
                        className="col-1-2">Stay Leader</BigButton>
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
