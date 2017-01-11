 // eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, hashHistory} from 'react-router';

import Home from './Home.jsx';
import ClanPage from './ClanPage.jsx';
import ClanList from './ClanList.jsx';
import CreateClan from './CreateClan.jsx';
import KickMember from './KickMember.jsx';
import TransferLeadership from './TransferLeadership.jsx';
import './table.scss';
import './main.scss';
import '../node_modules/simple-grid2/simplegrid.css';

import './utils/Session.jsx';


ReactDOM.render(
    <Router history={hashHistory }>
      <Route>
        <Route path="/" component={Home} />
        <Route path="/access_token=:token&token_type=*" component={Home} />
        <Route path="/clans" component={ClanList} />
        <Route path="/clan/:clanid" component={ClanPage} />
        <Route path="/action/create_clan" component={CreateClan} />
        <Route path="/action/kick/:membershipid" component={KickMember} />
        <Route path="/action/transferLeadership/:clanid/:playerid" component={TransferLeadership} />
      </Route>
    </Router>,
    document.getElementById('app')
);
