import React from 'react';
import Api from './utils/Api.jsx';
import Utils from './utils/Utils.jsx';

import Page from './Page.jsx';
import InputPair from './InputPair.jsx';

export default class ClanPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clan: null,
        };
        this.updated = false; // prevent DatTable to reinit if you visit the page again
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
            let button =`<a href="/action/kick/${membership.id}" class="btn btn-primary btn-xs">Kick Member</a>`;
            button += `<a href="/action/transferLeadership/${this.state.clan.id}/${membership.player.id}" class="btn btn-primary btn-xs">Make Founder</a>`;
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
        this.setState({ clan: data });
    }

    renderClan() {

        return <div>
      {this.renderClanData()}
      {this.renderClanMembers()}
    </div>;
    }

    renderClanData() {
        return <div className="well bs-component">
      <InputPair disabled={true} label="Tag" value={this.state.clan.tag} />
      <InputPair disabled={true} label="Tag" value={this.state.clan.name} />
      <InputPair disabled={true} label="Leader" value={this.state.clan.leader.login} />
      <InputPair disabled={true} label="Founder" value={this.state.clan.founder.login} />
      <InputPair disabled={true} label="Created At:" value={Utils.formatTimestamp(this.state.clan.createTime)} />
      <textarea  disabled value={this.state.clan.description || ''} />
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
