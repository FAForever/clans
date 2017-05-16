import React from 'react';
import { Link } from 'react-router';
import ReactTable from 'react-table';

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
        this.columns = [{
            Header: 'Name',
            accessor: 'player.login'
        }, {
            Header: 'Joined',
            id: 'createTime',
            accessor: data => Utils.formatTimestamp(data.createTime),
            width: 155
        }, {
            Header: 'Actions',
            id: 'actions',
            Cell: props => this.getActionBar(props.original),
            width: 200,
            filterable: false
        }];
        this.updateClan = this.updateClan.bind(this);
        this.getActionBar = this.getActionBar.bind(this);
        this.init = this.init.bind(this);
    }

    componentDidMount() {
        this.init();
    }
    componentWillReceiveProps(nextProps) {
        // TODO: make it better?
        this.init(nextProps.params.clanid);
    }

    init(clanid) {
        Api.json().one('clan', clanid || this.props.params.clanid).get({ include: 'memberships,memberships.player,founder,leader' })
            .then(this.setData.bind(this)).catch(error => console.error(error));
    }

    getActionBar(membership) {
        let player = Session.getPlayer();
        let isLeader = this.isLeader();
        let me = player != null && player.id == membership.player.id;
        let leave = (!isLeader && me)
            ? <Link to={`/action/leaveClan/${this.state.clan.id}`}>
                <button className="btn btn-primary btn-xs">Leave Clan</button>
            </Link>
            : '';
        let leaderActions = '';
        if (isLeader && !me) {
            leaderActions = <div>
                <Link to={`/action/kick/${membership.id}`}>
                    <button className="btn btn-primary btn-xs">Kick Member</button>
                </Link>
                <Link to={`/action/transferLeadership/${this.state.clan.id}/${membership.player.id}`}>
                    <button className="btn btn-primary btn-xs">Make Leader</button>
                </Link>
            </div>;
        }
        let leaderCannotLeave = (isLeader && me) ? 'Leader cannot leave' : '';
        return <div>{leave}{leaderActions}{leaderCannotLeave}</div>;
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
        if (player == null) {
            return false;
        }
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
            // TODO: is this needed?
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
            <ReactTable
                columns={this.columns}
                defaultPageSize={10}
                data={this.state.clan.memberships}
            />
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
