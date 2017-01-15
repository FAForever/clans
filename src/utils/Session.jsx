import axios from 'axios';
import Api from './Api.jsx';

import ClientOAuth2 from 'client-oauth2';

const clientId = '83891c0c-feab-42e1-9ca7-515f94f808ef';
const url = 'http://localhost:5000';
const redirect_uri = 'http://localhost:8080/';

const oauth = new ClientOAuth2( {
    clientId: clientId,
    authorizationUri: `${url}/oauth/authorize`,
    redirectUri: redirect_uri
});
let token;
let user;
try {
    user =  JSON.parse(localStorage.getItem('user'));
} catch(err) {
    console.log(err);
}
try {
    token = JSON.parse(localStorage.getItem('token'));
} catch(err) {
    console.log(err);
}

if(token) {
    registerTokenIntern(token);
}

function registerTokenIntern(newToken) {
    token = newToken;
    localStorage.setItem('token', JSON.stringify(token));
    Api.json().headers['Authorization'] = `Bearer ${token.access_token}`;
    grabUserData(token);
}

function grabUserData(token) {
    axios.get('http://localhost:5000/clans/me', 
            {headers: { Authorization: `Bearer ${token.access_token}`}})
            .then(function (response) {
                user = response.data;
                localStorage.setItem('user', JSON.stringify(user));
                dataChanged();
            })
            .catch(() => {
                logoutIntern();
            });
}

let listeners = [];

function dataChanged() {
    for(let listener in listeners) {
        listeners[listener]();
    }
}

function logoutIntern() {
    token = null;
    user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Api.json().headers['Authorization'] = null;
    dataChanged();
}

export default {
    getToken() {
        return token.access_token;
    },
    getUser() {
        return user;
    },
    getPlayer() {
        if(user != null && user.player != null) {
            return user.player;
        }
        return null;
    },
    getClan() {
        if(this.getUser()) {
            return this.getUser().clan;
        }
        return null;
    },
    getPlayername() {
        if(user != null && user.player != null) {
            return user.player.login;
        }
        return null;
    },
    loggedIn() {
        return token != null;
    },
    login() {
        // Open the page in a new window, then redirect back to a page that calls our global `oauth2Callback` function. 
        window.open(oauth.token.getUri(), '_self');
        dataChanged();
    },
    logout() {
        logoutIntern();
        
    },
    registerToken(token) {
        registerTokenIntern(token);
    },
    addListener(callback) {
        listeners.push(callback);
    },
    oauth
};