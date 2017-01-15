import React from 'react';
import { browserHistory } from 'react-router';

import Warning from './components/Warning.jsx';
import Api from './utils/Api.jsx';
import Session from './utils/Session.jsx';
import Toast from './utils/Toast.jsx';

import Page from './Page.jsx';
import InputPair from './InputPair.jsx';

export default class DeleteClan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clan: null,
            confirmName: null
        };
        this.deleteClan = this.deleteClan.bind(this);
    }

    componentDidMount() {
        Api.json().one('clan', this.props.params.clanid).get({ include: 'leader' }).then((data) => {
            this.setState({ clan: data });
        }).catch((error) => { console.error(error); });
    }

    componentDidUpdate() {
        if (this.state.clan && Session.getPlayer() && this.state.clan.leader.id != Session.getPlayer().id) {
            Toast.getContainer().error('You are not the Leader of the clan', 'No Access');
        }
    }

    deleteClan() {
        Api.delete(`clans/delete?clanid=${this.state.clan.id}`, () => {
            browserHistory.push('/');
        });
    }

    render() {
        if (!Session.getPlayer()) {
            return <Page title="No Access">
                <Warning message="Please log in" />
            </Page>;
        }
        if (this.state.clan) {
            return <Page title="Delete Clan">
                <Warning message="This operation is undoable" />
                <div className="well bs-component">
                    <p>This operation will kick all members and delete the whole clan.</p>
                    <InputPair disabled={true} label="Clan Tag" value={this.state.clan.tag} />
                    <InputPair disabled={true} label="Clan Name" value={this.state.clan.name} />
                    <p>To confirm this operation please type the name of the Clan</p>
                    <InputPair label="Confirmation" value={this.state.confirmName} onChange={(event) => {
                        this.setState({ confirmName: event.target.value });
                    } } />
                    <p />
                    <div className="grid">
                        <button disabled={this.state.confirmName != this.state.clan.name}
                            onClick={this.deleteClan}
                            className="col-1-2 btn btn-default btn-lg">Delete Clan</button>
                        <button onClick={browserHistory.goBack} className="col-1-2 btn btn-default btn-lg">Go Back</button>
                    </div>
                </div>
            </Page>;
        }
        return (
            <Page title="Loading..."></Page>
        );
    }
}
