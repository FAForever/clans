import React from 'react';

export default class InputPair extends React.Component {
    
    render() {
        return (
            <div className="grid ">
                <span className="col-1-6" id={this.props.label}>{this.props.label}</span>
                <input disabled={this.props.disabled} type="text" className="col-5-6" onChange={this.props.onChange} value={this.props.value || ''} aria-describedby={this.props.label} />
            </div>
        );
    }
}
