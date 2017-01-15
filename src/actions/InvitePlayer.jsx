import React from 'react';
import { browserHistory } from 'react-router';
import Autocomplete from 'react-autocomplete';

import Page from '../components/Page.jsx';
import InputPair from '../components/InputPair.jsx';

import Api from '../utils/Api.jsx';
import Toast from '../utils/Toast.jsx';
import Session from '../utils/Session.jsx';

export let styles = {
    item: {
        padding: '2px 6px',
        cursor: 'default'
    },

    highlightedItem: {
        color: 'white',
        background: 'hsl(200, 50%, 50%)',
        padding: '2px 6px',
        cursor: 'default'
    },

    menu: {
        border: 'solid 1px #ccc'
    }
};

export default class InvitePlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            players: [],
            loading: false,
            player: null,
            disabled: true,
            token: null
        };
        this.invite = this.invite.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    componentDidMount() {
        Api.json().one('clan', this.props.params.clanid).get({ include: 'leader' })
            .then(this.setData.bind(this)).catch(error => console.error(error));
    }

    setData(data) {
        if (!Session.loggedIn()) {
            Toast.getContainer().error('You are not logged in');
            return;
        }
        if (data == null) {
            Toast.getContainer().error('No clan found');
            return;
        }
        if (data.leader.id != Session.getPlayer().id) {
            Toast.getContainer().error('Only the leader can invite players', 'You have no permission');
            return;
        }
        this.setState({ clan: data });
    }

    invite() {
        if (this.state.player == null) {
            Toast.getContainer().error('You must select a player for invitation', 'No PLayer selected');
        }
        console.log(this.state.player);
        Api.get(`clans/generateInvitationLink?clanId=${this.state.clan.id}&playerId=${this.state.player.id}`, (response) => {
            this.setState({ token: response.data.jwtToken });
        });
        this.setState({ disabled: true });
        Toast.getContainer().info('Invitation link will be generated', 'Generate Invitation Link');
    }

    onChange(event, value) {
        let pagesize = 50;
        // to decrease server load and get result faster
        if (value.length <= 3) {
            pagesize = 10;
        } else if (value.length <= 5) {
            pagesize = 20;
        }
        // TODO: tune this
        this.setState({ value, loading: true, disabled: true });
        Api.json().findAll('player', {
            filter: `lowerCaseLogin==${value}*`,
            page: { size: pagesize },
            sort: 'lowerCaseLogin'
        })
            .then(function (data) {
                console.log(data);
                this.setState({ loading: false, players: data });
            }.bind(this)).catch(error => console.error(error));
    }

    onSelect(value, item) {
        this.setState({ value, player: item, disabled: item == null });
    }

    renderMenu(items, value, style) {
        return <div style={style}>{items}</div>;
    }

    renderItem(item, isHighlighted) {
        return <div style={isHighlighted ? styles.highlightedItem : styles.item}
            className="item" key={item.id}
            id={item.id}>{item.login}</div>;
    }

    renderLink() {
        if (this.state.token) {
            let link = `http://localhost:8080/action/accept#token=${this.state.token}`;
            return <div style={{ marginTop: '15px' }}>
                <p>3. Copy link to clipboard</p>
                <div className="grid ">
                    <span className="col-1-6" >Link</span>
                    <input id="InviteLink" disabled type="text" className="col-5-6" defaultValue={link} />
                </div>
                <p />
                <p>4. Send the link to the player, e.g. as personal message in faf, over Mumble, ...</p>
            </div>;
        }
    }

    render() {
        if (this.state.clan) {
            return <Page title="Invite Player">
                <div className="well bs-component">
                    <div className="grid ">
                        <p>Here you can invite players to your clan</p>
                        <InputPair disabled={true} label="Clan Tag" value={this.state.clan.tag} />
                        <InputPair disabled={true} label="Clan Name" value={this.state.clan.name} />
                        <p>1. Search the Player</p>
                        <span className="col-1-6">Player Name</span>
                        <div className="col-5-6">
                            <Autocomplete
                                ref="autocomplete"
                                value={this.state.value}
                                renderMenu={this.renderMenu}
                                items={this.state.players}
                                getItemValue={(item) => item.login}
                                onSelect={this.onSelect}
                                onChange={this.onChange}
                                renderItem={this.renderItem} />
                        </div>
                    </div>
                    <p />
                    <p>2. Generate Link</p>
                    <div className="grid" style={{ 'marginTop': '15px' }}>
                        <button disabled={this.state.disabled}
                            onClick={this.invite} className="col-1-1 btn btn-default btn-lg">
                            Generate Invitation Link
                        </button>
                    </div>{this.renderLink()}
                    <div className="grid" style={{ 'marginTop': '15px' }}>
                        <button onClick={browserHistory.goBack} className="col-1-1 btn btn-default btn-lg" >Go Back</button>
                    </div>
                </div>
            </Page>;
        }
        return <Page title="Loading..." />;
    }
}
