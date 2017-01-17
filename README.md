[![Build Status](https://travis-ci.org/FAForever/clans.svg)](https://travis-ci.org/FAForever/clans)

New Clan App based on the FAF API

This App is based on [React](https://facebook.github.io/react/) and is a [Single Page Application (SPA)](https://www.wikiwand.com/en/Single-page_application). For faster development and to keep the design and usage similar the old app some bootstrap components are used. 

The Endpoint of this app is the [FAF-API](https://github.com/FAForever/api). From my view the current python implementation is not stable and hard to extend, so I used the Java Implementation from downlord: https://github.com/micheljung/faf-java-api/tree/feature/clan

# Preconditions

1. FAF-DB (for the API): https://github.com/FAForever/db
2. FAF-Java-API: https://github.com/micheljung/faf-java-api/tree/feature/clan 

# Installation - without docker

1. Install node
2. Run `npm install`

# Installation with docker

1. `docker build -t faf-clanapp .`
2. `docker run --name faf-clanapp -d -p 8080:8080 --env-file .env.example faf-clanapp`

# Development Server

You can run the development server with (Port 8080 must be open)

    npm run dev
  
# Configuration

You must maybe adapt some environment variables, see `.env.example`.
In Development you find some fallback values in `webpack.config.js`

Don't forget to add a OAuth ClientId to the faf database, e.g.

    INSERT INTO `oauth_clients` (`id`, `name`, `client_secret`, `client_type`, `redirect_uris`, `default_redirect_uri`, `default_scope`) VALUES ('83891c0c-feab-42e1-9ca7-515f94f808ef', 'clanpp', '83891c0c-feab-42e1-9ca7-515f94f808ef', 'public', '-', '-', '-');


    
# Production Server

See the `.travis.yml` and `Dockerfile`
    
Visit http://localhost:8080/ to see the app.
