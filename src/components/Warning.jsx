import React from 'react';

export default class Warning extends React.Component {
    render() {
        return <div className="alert alert-danger" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign" /> {this.props.message}
        </div>;
    }
}
