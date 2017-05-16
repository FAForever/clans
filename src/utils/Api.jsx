import JsonApi from 'devour-client';
import axios from 'axios';

import Session from './Session.jsx';
import Toast from './Toast.jsx';
import Config from './Config.jsx';

const apiUrl = Config.getApiBaseUrl();
let jsonApi = new JsonApi({
    apiUrl: `${apiUrl}/data`,
    pluralize: false
});

jsonApi.define('clan', {
    description: '',
    name: '',
    tag: '',
    websiteUrl: '',
    tagColor: null,
    createTime: null,
    updateTime: null,
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
        type: 'clanMembership'
    }
});

jsonApi.define('clanMembership', {
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
    lowerCaseLogin: '',
    userAgent: '',
    createTime: null,
    updateTime: null,
    clanMemberships: {
        jsonApi: 'hasMany',
        type: 'clanMembership'
    },
    globalRating: {
        jsonApi: 'hasOne',
    },
    banInfo: {
        jsonApi: 'hasOne'
    },
    ladder1v1Rating: {
        jsonApi: 'hasOne'
    }
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
        axios.get(`${apiUrl}${url}`,
            getHeader())
            .then(sucessCallback)
            .catch(errorCallback);
    },
    post(url, sucessCallback) {
        axios.post(`${apiUrl}${url}`,
            null,
            getHeader())
            .then(sucessCallback)
            .catch((error) => {
                this.error(error);
            });
    },
    delete(url, sucessCallback) {
        axios.delete(`${apiUrl}${url}`,
            getHeader())
            .then(sucessCallback)
            .catch((error) => {
                this.error(error);
            });
    },
    error(errors) {
        for (let error of errors.response.data.errors) {
            Toast.getContainer().error(error.detail, error.title);
        }
    },
    jsonError(errorData) {
        console.error(errorData);
        Toast.getContainer().error(errorData['']);
    },
    json() {
        jsonApi.headers['Authorization'] = Session.getToken() ? `Bearer ${Session.getToken()}` : null;
        return jsonApi;
    }
};
