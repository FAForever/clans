import React from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router';

import Api from '../utils/Api.jsx';
import Page from '../components/Page.jsx';

export default class ClanList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pages: null,
            loading: true
        };
        this.columns = [{
            Header: 'Name',
            accessor: 'name'
        }, {
            Header: 'Tag',
            accessor: 'tag',
            width: 55
        }, {
            Header: 'Leader',
            accessor: 'leader.login',
            width: 150
        }, {
            Header: 'Members',
            id: 'member',
            accessor: clan => clan.memberships.length,
            width: 80
        }, {
            Header: 'Actions',
            accessor: 'action',
            // TODO: find devoour? bug
            Cell: props => //<Link to={`clan/${props.original.id}`}>
                <a href={`clan/${props.original.id}`}>
                <button alt={props.original.id} className="btn btn-primary btn-xs">ClanPage</button>
                </a>,
            //</Link>,
            width: 85,
            hideFilter: true
        }];
        this.fetchData = this.fetchData.bind(this);
    }

    fetchData(tableState) {
        console.log(tableState);
        this.setState({ loading: true });
        Api.json().findAll('clan',
            {
                page:
                {
                    size: tableState.pageSize,
                    number: tableState.page + 1,
                    totals: true
                },
                include: 'founder,leader,memberships'
            })
            .then(data => {
                this.setState({ data, loading: false, pages: data.meta.page.totalPages });
            }).catch(error => console.error(error));
    }

    render() {
        return <Page title="Clans">
            <ReactTable
                //showFilters={true}
                //defaultFilterMethod={this.filter}
                columns={this.columns}
                manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                defaultPageSize={10}
                data={this.state.data} // Set the rows to be displayed
                pages={this.state.pages} // Display the total number of pages
                loading={this.state.loading} // Display the loading overlay when we need it
                onFetchData={this.fetchData} // Request new data when things change
            />
        </Page>;
    }
}
