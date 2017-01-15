import React from 'react';

import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';

export default class Page extends React.Component {
    render() {
        return (
            <div>
                <NavBar />
                {this.props.warning &&
                    <Warning message={this.props.warning} />
                }

                <div className="container">
                    {this.props.title &&
                        <h1 id="title">{this.props.title}</h1>
                    }
                    {this.props.children}
                </div>
                <Footer />
            </div>
        );
    }
}
