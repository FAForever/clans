import React from 'react';
import { browserHistory } from 'react-router';
import Autocomplete from 'react-autocomplete';

import Page from './Page.jsx';

import Api from './utils/Api.jsx';
import Toast from './utils/Toast.jsx';
import Session from './utils/Session.jsx';

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

    invite() {   
        if(Session.getClan() == null) {
            Toast.getContainer().error('You are not in a clan', 'No Clan found');
        }
        if(this.state.player == null) {
            Toast.getContainer().error('You must select a player for invitation', 'No PLayer selected');
        }
        console.log(this.state.player);
        Api.get(`clans/generateInvitationLink?clanId=${Session.getClan().id}&playerId=${this.state.player.id}`, (response) => {
            this.setState({token: response.data.jwtToken});
        });
        this.setState({disabled: true});
        Toast.getContainer().info('Invitation link will be generated', 'Generate Invitation Link');
    }

    onChange(event, value) {
        let pagesize = 50;
        // to decrease server load and get result faster
        if(value.length <= 3) {
            pagesize = 10;
        } else if(value.length <= 5) {
            pagesize = 20;
        }
        // TODO: tune this
        this.setState({ value, loading: true, disabled: true });
        Api.json().findAll('player', { 
            filter: `lowerCaseLogin==${value}*`, 
            page: {size: pagesize},
            sort: 'lowerCaseLogin'})
            .then(function(data) {
                console.log(data);
                this.setState({ loading : false, players: data});
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
        if(this.state.token) {
            let link = `http://localhost:8080/action/accept#token=${this.state.token}`;
            return <div style={{marginTop: '15px'}}>
                        <p>Copy link, send it to the player, then he can join your clan.</p>
                        <div className="grid ">
                            <span className="col-1-6" >Link</span>
                            <input id="InviteLink" disabled type="text" className="col-5-6" defaultValue={link} />
                        </div>
                    </div>;
        }
    }

    render() {
        return <Page title="Invite Player">
                <div className="well bs-component">
                    <div className="grid ">
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
                            renderItem={this.renderItem}/>
                        </div>
                    </div>
                    <div className="grid" style={{ 'marginTop': '15px' }}>
                        <button disabled={this.state.disabled} 
                        onClick={this.invite} className="col-1-2 btn btn-default btn-lg">
                            Generate Invitation Link
                        </button>
                        <button onClick={browserHistory.goBack} className="col-1-2 btn btn-default btn-lg" >Go Back</button>
                    </div>{this.renderLink()}
                </div>
                </Page>;
    }
}
