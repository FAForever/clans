import React from 'react';
import { browserHistory } from 'react-router';

import Utils from './utils/Utils.jsx';
import Api from './utils/Api.jsx';

import Page from './Page.jsx';
import InputPair from './InputPair.jsx';

export default class CreateClan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: '',
            name: '',
            description: ''
        };
    }

    onTagChange(event) {
        let newValue = event.target.value;
        if (newValue.length <= 3) {
            this.setState({ tag: newValue });
        }
    }

    onNameChange(event) {
        let newValue = event.target.value;
        if (newValue.length <= 40) {
            this.setState({ name: event.target.value });
        }
    }

    onDescChange(event) {
        this.setState({ description: event.target.value });
    }

    renderClanData() {
        return <div className="well bs-component">
            <InputPair label="Tag" value={this.state.tag} onChange={this.onTagChange.bind(this)} />
            <InputPair label="Name" value={this.state.name} onChange={this.onNameChange.bind(this)} />
            <InputPair disabled={true} label="Leader" value="You" />
            <InputPair disabled={true} label="Founder" value="You" />
            <InputPair disabled={true} label="Created At:" value={Utils.formatTimestamp(null)} />
            <textarea value={this.state.description} onChange={this.onDescChange.bind(this)} />
            <button onClick={this.submitData.bind(this)} className="btn btn-default btn-lg">Create New Clan</button>
        </div>;
    }

    submitData() {
        console.log(this.state);
        let params = `tag=${encodeURIComponent(this.state.tag)}&name=${encodeURIComponent(this.state.name)}`;
        params += `&description=${encodeURIComponent(this.state.description)}`;
        Api.post(`clans/create?${params}`, function(response) {
            browserHistory.push(`/clan/${response.data.id}`);
        });
    }

    render() {
        return (
            <Page title="Create New Clan">{this.renderClanData()}</Page>
        );
    }
}
