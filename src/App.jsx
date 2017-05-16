 // eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, browserHistory} from 'react-router';

import Home from './pages/Home.jsx';
import ClanPage from './pages/ClanPage.jsx';
import ClanList from './pages/ClanList.jsx';
import CreateClan from './actions/CreateClan.jsx';
import DeleteClan from './actions/DeleteClan.jsx';
import KickMember from './actions/KickMember.jsx';
import TransferLeadership from './actions/TransferLeadership.jsx';
import InvitePlayer from './actions/InvitePlayer.jsx';
import AcceptInvitation from './actions/AcceptInvitation.jsx';
import LeaveClan from './actions/LeaveClan.jsx';

import '../node_modules/simple-grid2/simplegrid.css';
import 'react-table/react-table.css';
import './main.scss';


import './utils/Session.jsx';

ReactDOM.render(
    <Router history={browserHistory }>
      <Route>
        <Route path="/" component={Home} />
        <Route path="/clans" component={ClanList} />
        <Route path="/clan/:clanid" component={ClanPage} />
        <Route path="/action/createClan" component={CreateClan} />
        <Route path="/action/deleteClan/:clanid" component={DeleteClan} />
        <Route path="/action/kick/:membershipid" component={KickMember} />
        <Route path="/action/transferLeadership/:clanid/:newleaderid" component={TransferLeadership} />
        <Route path="/action/invitePlayer/:clanid" component={InvitePlayer} />
        <Route path="/action/accept" component={AcceptInvitation} />
        <Route path="/action/leaveClan/:clanid" component={LeaveClan} />
      </Route>
    </Router>,
    document.getElementById('app')
);
