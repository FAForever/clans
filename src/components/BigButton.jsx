import React from 'react';

export default class BigButton extends React.Component {
    render() {
        return <button disabled={this.props.disabled} className={`${this.props.className} btn btn-default btn-lg`} onClick={this.props.onClick}>
            {this.props.children}
        </button>;
    }
}
