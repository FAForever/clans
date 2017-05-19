import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
    <footer className="footer">
      <div className="container secondary">
        <ul className="nav navbar-nav">
          <li><a href="http://www.faforever.com/">Forged Alliance Forever</a></li>
          <li><a href="http://forums.faforever.com/">Forum</a></li>
          <li><a href="https://github.com/FAForever/clans">Sources</a></li>
          <li><a href="https://github.com/FAForever/clans/issues">Issues</a></li>
          <li><a href="https://github.com/FAForever/clans/graphs/contributors">Authors</a></li>
        </ul>
      </div>
    </footer>
        );
    }
}
