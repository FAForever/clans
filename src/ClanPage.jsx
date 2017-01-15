import React from 'react';
import { Link } from 'react-router';

import Api from './utils/Api.jsx';
import Utils from './utils/Utils.jsx';
import Session from './utils/Session.jsx';
import Toast from './utils/Toast.jsx';

import Clan from './components/Clan.jsx';
import Warning from './components/Warning.jsx';
import Page from './Page.jsx';

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
        this.deleteClan = this.deleteClan.bind(this);
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
            let button = `<button onclick="window.myHistory.push('/action/kick/${membership.id}')" class="btn btn-primary btn-xs">Kick Member</button>`;
            button += `<button onclick="window.myHistory.push('/action/transferLeadership/${this.state.clan.id}/${membership.player.id}')" class="btn btn-primary btn-xs">Make Founder</button>`;
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
        return this.state.clan.leader.id == Session.getPlayer().id;
    }

    dirty() {
        return this.state.clan.tag != this.state.oldTag
            || this.state.clan.name != this.state.oldName
            || this.state.clan.description != this.state.oldDesc;
    }

    updateClan() {
        console.log(this.state.clan);
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

    deleteClan() {

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
                    } }
                    name={this.state.clan.name} onNameChange={(value) => {
                        this.state.clan.name = value;
                        this.setState(this.state);
                    } }
                    leader={this.state.clan.leader.login}
                    founder={this.state.clan.founder.login}
                    created={Utils.formatTimestamp(this.state.clan.createTime)}
                    description={this.state.clan.description || ''} onDescChange={(value) => {
                        this.state.clan.description = value;
                        this.setState(this.state);
                    } } />
                {this.isLeader() &&
                    <div className="grid" style={{ marginTop: '15px' }}>
                        <button disabled={!this.dirty()}
                            className="col-1-2 btn btn-default btn-lg"
                            onClick={this.updateClan}>Update Clan Data</button>
                        <Link to={`/action/deleteClan/${this.state.clan.id}`}
                            className="col-1-2 btn btn-default btn-lg">Delete Clan</Link>
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
        </div>;
    }

    render() {
        if (this.state.clan) {
            return <Page title={'Clan: ' + this.state.clan.name}>{this.renderClan()}</Page>;
        }
        return <Page title="Loading..." />;
    }
}
