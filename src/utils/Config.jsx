export default {
    getApiBaseUrl() {
        return process.env.API_BASE_URL;
    },
    getOAuth() {
        return {
            clientId: process.env.OAUTH_CLIENT_ID,
            redirectUri: process.env.OAUTH_REDIRECT_URI
        }
    }
};

