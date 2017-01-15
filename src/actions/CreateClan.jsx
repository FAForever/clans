import React from 'react';
import { browserHistory } from 'react-router';

import Utils from '../utils/Utils.jsx';
import Session from '../utils/Session.jsx';
import Api from '../utils/Api.jsx';

import Page from '../components/Page.jsx';
import Clan from '../components/Clan.jsx';
import Warning from '../components/Warning.jsx';
import BigButton from '../components/BigButton.jsx';

export default class CreateClan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: '',
            name: '',
            description: ''
        };
    }

    submitData() {
        console.log(this.state);
        let params = `tag=${encodeURIComponent(this.state.tag)}&name=${encodeURIComponent(this.state.name)}`;
        params += `&description=${encodeURIComponent(this.state.description)}`;
        Api.post(`/clans/create?${params}`, function (response) {
            browserHistory.push(`/clan/${response.data.id}`);
        });
    }

    render() {
        if (Session.getClan()) {
            return <Page><Warning message="You are allready in a clan" /></Page>;
        }
        if (Session.loggedIn()) {
            return <Page title="Create New Clan">
                <div className="well bs-component"><Clan disabled={false} clan={this.state.clan}
                    tag={this.state.tag} onTagChange={(value) => {
                        this.setState({ tag: value });
                    } }
                    name={this.state.name} onNameChange={(value) => {
                        this.setState({ name: value });
                    } }
                    leader="You"
                    founder="You"
                    created={Utils.formatTimestamp()}
                    description={this.state.description || ''} onDescChange={(value) => {
                        this.setState({ description: value });
                    } } />
                    <div className="grid" style={{ marginTop: '15px' }}>
                        <BigButton disabled={this.state.tag == '' || this.state.name == ''}
                            onClick={this.submitData.bind(this)}
                            className="col-1-1">Create New Clan</BigButton>
                    </div>
                </div></Page>;
        }
        return <Page><Warning message="Please log in" /></Page>;
    }
}
