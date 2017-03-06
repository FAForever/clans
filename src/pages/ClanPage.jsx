import React from 'react';
import { Link } from 'react-router';

import Api from '../utils/Api.jsx';
import Utils from '../utils/Utils.jsx';
import Session from '../utils/Session.jsx';
import Toast from '../utils/Toast.jsx';

import Clan from '../components/Clan.jsx';
import Warning from '../components/Warning.jsx';
import BigButton from '../components/BigButton.jsx';
import Page from '../components/Page.jsx';

import _ from 'lodash';

export default class ClanPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clan: null,
            leader: false,
            oldTag: null,
            oldName: null,
            oldDesc: null
        };
        this.updated = false; // prevent DatTable to reinit if you visit the page again
        this.updateClan = this.updateClan.bind(this);
    }

    componentDidMount() {
        Api.json().one('clan', this.props.params.clanid).get({ include: 'memberships,memberships.player,founder,leader' })
            .then(this.setData.bind(this)).catch(error => console.error(error));
    }

    componentDidUpdate() {
        if (!this.state.clan || this.updated) {
            return;
        }
        var dataSet = [];
        for (let membership of this.state.clan.memberships) {
            let button = '';
            if (this.isLeader()) {
                button += `<button onclick="window.myHistory.push('/action/kick/${membership.id}')" class="btn btn-primary btn-xs">Kick Member</button>`;
                button += `<button onclick="window.myHistory.push('/action/transferLeadership/${this.state.clan.id}/${membership.player.id}')" class="btn btn-primary btn-xs">Make Leader</button>`;
            }
            dataSet.push([membership.player.login, Utils.formatTimestamp(membership.createTime), button]);
        }
        // eslint-disable-next-line no-undef
        $('#clan_members').DataTable({
            data: dataSet
        });
        this.updated = true;
    }

    setData(data) {
        if (data == null) {
            console.log('No clan found');
        }
        this.setState({ clan: data, oldTag: data.tag, oldName: data.name, oldDesc: data.description });
    }

    isLeader() {
        return Session.getPlayer() && this.state.clan.leader.id == Session.getPlayer().id;
    }

    isClanMember() {
        let player = Session.getPlayer();
        let myMembership = _.find(this.state.clan.memberships, (membership) => {
            return membership.player.id == player.id;
        });
        return myMembership;
    }

    dirty() {
        return this.state.clan.tag != this.state.oldTag
            || this.state.clan.name != this.state.oldName
            || this.state.clan.description != this.state.oldDesc;
    }

    updateClan() {
        Api.json().update('clan', {
            id: this.state.clan.id,
            tag: this.state.clan.tag,
            name: this.state.clan.name,
            description: this.state.clan.description
        }).then(() => {
            this.componentDidMount();
            Toast.getContainer().success('Clan successful updated', 'Clan Data saved');
        }).catch((error) => {
            console.error(error);
        });
    }

    renderClan() {
        return <div>
            {this.dirty() &&
                <Warning hidden={this.state.clan.tag == this.state.oldTag} message="Changes are unsaved" />
            }
            <div className="well bs-component">
                <Clan disabled={!this.isLeader()} clan={this.state.clan}
                    tag={this.state.clan.tag} onTagChange={(value) => {
                        this.state.clan.tag = value;
                        this.setState(this.state);
                    }}
                    name={this.state.clan.name} onNameChange={(value) => {
                        this.state.clan.name = value;
                        this.setState(this.state);
                    }}
                    leader={this.state.clan.leader.login}
                    founder={this.state.clan.founder.login}
                    created={Utils.formatTimestamp(this.state.clan.createTime)}
                    description={this.state.clan.description || ''} onDescChange={(value) => {
                        this.state.clan.description = value;
                        this.setState(this.state);
                    }} />
                {this.isLeader() &&
                    <div className="grid" style={{ marginTop: '15px' }}>
                        <BigButton disabled={!this.dirty()}
                            className="col-1-3"
                            onClick={this.updateClan}>Update Clan Data</BigButton>
                        <Link to={`/action/invitePlayer/${this.state.clan.id}`}
                            className="col-1-3 btn btn-default btn-lg">Invite Player</Link>
                        <Link to={`/action/deleteClan/${this.state.clan.id}`}
                            className="col-1-3 btn btn-default btn-lg">Delete Clan</Link>
                    </div>
                }
            </div>
            {this.renderClanMembers()}
        </div>;
    }

    renderClanMembers() {
        return <div className="well">
            <h2>Clan Members</h2>
            <table id="clan_members" className="table table-striped table-bordered" cellSpacing="0" width="100%">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
            </table>
            {this.isClanMember() &&
                <div className="grid">
                    <br />
                    <Link to={`/action/leaveClan/${this.state.clan.id}`}
                        className="col-1-1 btn btn-default btn-lg">Leave Clan</Link>
                </div>
            }
        </div>;
    }

    render() {
        if (this.state.clan) {
            return <Page title={'Clan: ' + this.state.clan.name}>{this.renderClan()}</Page>;
        }
        return <Page title="Loading..." />;
    }
}
