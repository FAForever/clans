import React from 'react';

import InputPair from './InputPair.jsx';

export default class Clan extends React.Component {
    constructor(props) {
        super(props);
        this.onTagChange = this.onTagChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onDescChange = this.onDescChange.bind(this);
    }

    onTagChange(event) {
        let newValue = event.target.value;
        if (newValue.length <= 3 && this.props.onTagChange)  {
            this.props.onTagChange(newValue);
        }
    }

    onNameChange(event) {
        let newValue = event.target.value;
        if (newValue.length <= 40 && this.props.onNameChange)  {
            this.props.onNameChange(newValue);
        }
    }

    onDescChange(event) {
        if (this.props.onDescChange)  {
            this.props.onDescChange(event.target.value);
        }
    }

    render() {
        return <div>
            <InputPair disabled={this.props.disabled} label="Tag" value={this.props.tag} onChange={this.onTagChange}/>
            <InputPair disabled={this.props.disabled} label="Name" value={this.props.name} onChange={this.onNameChange}/>
            <InputPair disabled label="Leader" value={this.props.leader}/>
            <InputPair disabled label="Founder" value={this.props.founder} />
            <InputPair disabled label="Created At:" value={this.props.created} />
            <textarea disabled={this.props.disabled} value={this.props.description || ''} onChange={this.onDescChange}/>
        </div>;
    }
}
