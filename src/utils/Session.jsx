import ClientOAuth2 from 'client-oauth2';
import axios from 'axios';

const clientId = '83891c0c-feab-42e1-9ca7-515f94f808ef';
const url = 'http://localhost:5000';
const redirect_uri = 'http://localhost:8080/';

const oauth = new ClientOAuth2({
    clientId: clientId,
    authorizationUri: `${url}/oauth/authorize`,
    redirectUri: redirect_uri
});
let token;
let user;
let listeners = [];

try {
    user = JSON.parse(localStorage.getItem('user'));
} catch (err) {
    console.log(err);
}
try {
    token = JSON.parse(localStorage.getItem('token'));
} catch (err) {
    console.log(err);
}

if (validToken()) {
    grabUserData();
}

function validToken() {
    // TODO: pre test if expired
    return token;
}

function grabUserData() {
    // we must make own call, because API cannot access us on initilization
    axios.get('http://localhost:5000/clans/me',
        { headers: { Authorization: `Bearer ${token.access_token}` } })
        .then((response) => {
            user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            dataChanged();
        }).catch(logoutIntern);
}

function dataChanged() {
    for (let listener in listeners) {
        listeners[listener]();
    }
}

function logoutIntern() {
    token = null;
    user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dataChanged();
}

export default {
    getToken() {
        return token ? token.access_token : null;
    },
    getPlayer() {
        if (user && user.player) {
            return user.player;
        }
        return null;
    },
    getClan() {
        if (user && user.clan) {
            return user.clan;
        }
        return null;
    },
    getPlayername() {
        if (this.getPlayer()) {
            return this.getPlayer().login;
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
    registerToken(newToken) {
        token = newToken;
        localStorage.setItem('token', JSON.stringify(newToken));
        grabUserData();
    },
    addListener(callback) {
        listeners.push(callback);
    },
    oauth
};