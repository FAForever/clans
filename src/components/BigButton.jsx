import React from 'react';

export default class BigButton extends React.Component {
    render() {
        return <button className={`${this.props.className} btn btn-default btn-lg`}>
            {this.props.children}
        </button>;
    }
}
