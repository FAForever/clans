[![Build Status](https://travis-ci.org/FAForever/clans.svg)](https://travis-ci.org/FAForever/clans)

New Clan App based on the FAF API

This App is based on [React](https://facebook.github.io/react/) and is a [Single Page Application (SPA)](https://www.wikiwand.com/en/Single-page_application). For faster development and to keep the design and usage similar the old app some bootstrap components are used. 

The Endpoint of this app is the [FAF-API](https://github.com/FAForever/api). From my view the current python implementation is not stable and hard to extend, so I used the Java Implementation from downlord: https://github.com/micheljung/faf-java-api/tree/feature/clan

# Preconditions

1. FAF-DB (for the API): https://github.com/FAForever/db
2. FAF-Java-API: https://github.com/micheljung/faf-java-api/tree/feature/clan 

# Installation without Docker

1. Install node
2. Run `npm install`

# Installation with Docker

1. `docker build -t faf-clanapp .`
2. `docker run --name faf-clanapp -d -p 8080:8080 --env-file .env.example faf-clanapp`

# Development Server

You can run the development server with (Port 8080 must be open)

    npm run dev
    
Don't forget to run the tests (currently only eslint)

    npm test 
  
# Configuration

You must maybe adapt some environment variables, see `.env.example`.
In Development Mode you find some fallback values in `webpack.config.js`

Don't forget to add a OAuth ClientId to the faf database, e.g.

    INSERT INTO `oauth_clients` (`id`, `name`, `client_secret`, `client_type`, `redirect_uris`, `default_redirect_uri`, `default_scope`) VALUES ('83891c0c-feab-42e1-9ca7-515f94f808ef', 'clanpp', '83891c0c-feab-42e1-9ca7-515f94f808ef', 'public', '-', '-', '-');

    
# Production Server

See the `.travis.yml` and `Dockerfile`
    
Visit [http://localhost:8080/](http://localhost:8080/) to see the app.

# Features
This list ist a little overview, maybe some kind of specification for the clan app

#### General
* A user can login with the faf credentials over OAuth
* A user can logout 
* A logged in user see his clan
* A logged in user has a shortcut to navigate to his clan
* A logged in user can create a new clan

#### Clan List
* A user can see a list of clans
* A user can search in this list
* A user sort the list of clans (by Name, Taag, Leaer, Member Count)
* A user can see get navigate to the Clan Page

#### Clan Page
* A user see some basic data about the clan (name, tag, description, leader, founder, foundet at)
* A user see a list of all clan members
* A user can sort the list of clan members
* A user can search the list of clan members
* A clan member clan leave the clan
* A clan leader can edit the basic clan data except founder and created at
* A clan leader can invite players see Clan Invitation
* A clan leader can delete the clan
* A clan leader can kick members
* A clan leader can transfer the leadership to a clan member

#### Clan Invitation
* A clan leader can generate an invitation link
* A user can with the correct invitation link join the clan

# Technolgies

* React for building user interfaces: https://github.com/facebook/react
* Webpack to bundle the app: https://github.com/webpack/webpack 
* Devour as JSON API Client: https://github.com/twg/devour
* OAuth-Client: https://github.com/mulesoft/js-client-oauth2 
* Lodash as JavaScript Helper: https://github.com/lodash/lodash
* jwt simple to read [JWT Token](https://jwt.io/) for clan invitation link: https://github.com/hokaccha/node-jwt-simple
* simple-grid2 for layout: https://github.com/CezaryDanielNowak/Simple-Grid2
* webpack-dev-server for faster development, e.g. LiveReload: https://github.com/webpack/webpack-dev-server


# Resources

* JavaScript Documentation: http://devdocs.io/
* Webpack-Dev-Server Documentation: https://webpack.github.io/docs/webpack-dev-server.html 
* React Documentation: https://facebook.github.io/react/docs/hello-world.html 


I suggest to use [Visual Studio Code](https://facebook.github.io/react/docs/hello-world.html) for development with this plugins:
* ESLint
* Sass

