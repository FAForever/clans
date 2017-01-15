import JsonApi from 'devour-client';
import axios from 'axios';

import Session from './Session.jsx';
import Toast from './Toast.jsx';

let jsonApi = new JsonApi({
    apiUrl: 'http://localhost:5000/data',
    pluralize: false
});

jsonApi.define('clan', {
    description: '',
    name: '',
    tag: '',
    tagcolor: null,
    createTime: null,
    founder: {
        jsonApi: 'hasOne',
        type: 'player'
    },
    leader: {
        jsonApi: 'hasOne',
        type: 'player'
    },
    memberships: {
        jsonApi: 'hasMany',
        type: 'clan_membership'
    }
});

jsonApi.define('clan_membership', {
    createTime: null,
    updateTime: null,
    clan: {
        jsonApi: 'hasOne',
        type: 'clan'
    },
    player: {
        jsonApi: 'hasOne',
        type: 'player'
    }
});

jsonApi.define('player', {
    login: '',
    eMail: '',
    //Bug in Devour: https://github.com/twg/devour/issues/47
    // clanMemberships: {
    //     jsonApi: 'hasMany',
    //     type: 'clan_membership'
    // }
});

function getHeader() {
    if (Session.getToken()) {
        return { headers: { Authorization: `Bearer ${Session.getToken()}` } };
    }
    return {};
}

export default {
    get(url, sucessCallback) {
        this.getError(url, sucessCallback, this.error);
    },
    getError(url, sucessCallback, errorCallback) {
        axios.get(`http://localhost:5000/${url}`,
            getHeader())
            .then(sucessCallback)
            .catch(errorCallback);
    },
    post(url, sucessCallback) {
        axios.post(`http://localhost:5000/${url}`,
            getHeader())
            .then(sucessCallback)
            .catch((error) => {
                this.error(error);
            });
    },
    delete(url, sucessCallback) {
        axios.delete(`http://localhost:5000/${url}`,
            getHeader())
            .then(sucessCallback)
            .catch((error) => {
                this.error(error);
            });
    },
    error(error) {
        Toast.getContainer().error(error.response.data.message, error.response.data.error);
    },
    json() {
        jsonApi.headers['Authorization'] = Session.getToken() ? `Bearer ${Session.getToken()}` : null;
        return jsonApi;
    }
};
