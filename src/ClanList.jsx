import React from 'react';
import { Api } from './utils/Api.jsx';

import Page from './Page.jsx';

export default class ClanList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null
        };
    }

    componentDidMount() {
        Api.all('clan').get({ include: 'founder,leader,memberships' })
      .then(this.setData.bind(this)).catch(error => console.error(error));
    }

    componentDidUpdate() {
        if(!this.state.list) {
            return;
        }
        var dataSet = [];
        for (let clan of this.state.list) {
            var button = '<a href="#/clan/' + clan.id + '" class="btn btn-primary btn-xs">Open Clanpage</a>';
            dataSet.push([clan.name, clan.tag, clan.leader.login, clan.memberships.length, button]);
        }
        // eslint-disable-next-line no-undef
        $('#clanlist').DataTable({
            data: dataSet
        });
    }

    setData(data) {
        if (data == null) {
            console.log('Api not available');
        }
        this.setState({ list: data });
    }

    renderLoading() {
        return 'Loading ...';
    }

    renderData() {
        return <table id="clanlist" className="table table-striped table-bordered" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Name</th>
          <th>Tag</th>
          <th>Leader</th>
          <th>Members</th>
          <th>Actions</th>
        </tr>
      </thead>
    </table>;
    }

    render2() {
        if (this.state.list) {
            return this.renderData();
        }
        return this.renderLoading();
    }

    render() {
        return (
      <Page title="Clans">{this.render2()}</Page>
        );
    }
}
