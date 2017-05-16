// eslint-disable-next-line no-undef
if (process.env.NODE_ENV == 'production') {
    console.warn = function () { };
    console.log = function () { };
}

export default {
    // env value are injected via webpack.DefinePlugin
    getApiBaseUrl() {
        // eslint-disable-next-line no-undef
        return process.env.API_BASE_URL;
    },
    getOAuth() {
        return {
            // eslint-disable-next-line no-undef
            clientId: process.env.OAUTH_CLIENT_ID,
            // eslint-disable-next-line no-undef
            redirectUri: process.env.OAUTH_REDIRECT_URI
        };
    }
};

