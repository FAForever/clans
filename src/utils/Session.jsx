import axios from 'axios';
import { Api } from './Api.jsx';

const clientId = '83891c0c-feab-42e1-9ca7-515f94f808ef';
const url = 'http://localhost:5000';
const redirect_uri = 'http://localhost:8080';

let user =  JSON.parse(localStorage.getItem('user'));
let token = localStorage.getItem('token');
if(token) {
    registerTokenIntern(token);
}

function registerTokenIntern(newToken) {
    token = newToken;
    localStorage.setItem('token', token);
    Api.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    grabUserData(token);
}

function grabUserData(token) {
    axios.get('http://localhost:5000/clans/me', 
            {headers: { Authorization: `Bearer ${token}`}})
            .then(function (response) {
                user = response.data;
                localStorage.setItem('user', JSON.stringify(user));
                dataChanged();
            })
            .catch(function (error) {
                console.log(error);
            });
}

let listeners = [];

function dataChanged() {
    for(let listener in listeners) {
        listeners[listener]();
    }
}

export default {
    getUser() {
        return user;
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
        window.location = `${url}/oauth/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirect_uri}`;
        dataChanged();
    },
    logout() {
        token = null;
        user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Api.headers['Authorization'] = null;
        dataChanged();
    },
    registerToken(token) {
        registerTokenIntern(token);
    },
    addListener(callback) {
        listeners.push(callback);
    }
};