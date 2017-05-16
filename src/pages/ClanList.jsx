import React from 'react';
import ReactTable from 'react-table';
import { Link } from 'react-router';

import Utils from '../utils/Utils.jsx';
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
        // TODO: not working in the state, find out why
        this.sorted = [];
        this.columns = [{
            Header: '#',
            accessor: 'id',
            width: 50,
            filterable: false
        }, {
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
            width: 80,
            filterable: false
        }, {
            Header: 'Created',
            id: 'createTime',
            accessor: clan => Utils.formatTimestamp(clan.createTime),
            width: 155,
            filterable: false
        }, {
            Header: 'Actions',
            id: 'action',
            Cell: props => <Link to={`clan/${props.original.id}`}>
                <button alt={props.original.id} className="btn btn-primary btn-xs">ClanPage</button>
            </Link>,
            width: 85,
            filterable: false
        }];
        this.fetchData = this.fetchData.bind(this);
        this.sortString = this.sortString.bind(this);
        this.filterString = this.filterString.bind(this);
        this.onSortedChange = this.onSortedChange.bind(this);
    }

    fetchData(tableState) {
        this.setState({ loading: true });
        Api.json().findAll('clan',
            this.sortString(
                this.filterString({
                    page:
                    {
                        size: tableState.pageSize,
                        number: tableState.page + 1,
                        totals: true
                    },
                    include: 'founder,leader,memberships',
                }, tableState.filtered), tableState.sorted))
            .then(data => {
                this.setState({ data, loading: false, pages: data.meta.page.totalPages });
            }).catch(error => console.error(error));
    }

    sortString(src) {
        if (this.sorted.length == 1) {
            let field = this.sorted[0].id;
            if (field == 'name' || field == 'tag' || field == 'createTime') {
                let prefix = (this.sorted[0].desc === true) ? '-' : '';
                src.sort = prefix + field;
            }
        }
        return src;
    }
    filterString(src, filterFields) {
        let filter = '';
        filterFields.forEach(field => {
            if (filter != '') {
                filter += ';';
            }
            filter += `${field.id}==*${field.value}*`;
        });
        if (filter != '') {
            src.filter = filter;
        }
        return src;
    }
    onSortedChange(sorted, column) {
        if (column.id == 'name' || column.id == 'tag' || column.id == 'createTime') {
            this.sorted = sorted;
        } else {
            this.sorted = [];
        }
    }


    render() {
        return <Page title="Clans">
            <ReactTable
                columns={this.columns}
                manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                defaultPageSize={10}
                filterable
                sorted={this.sorted}
                onSortedChange={this.onSortedChange}
                data={this.state.data} // Set the rows to be displayed
                pages={this.state.pages} // Display the total number of pages
                loading={this.state.loading} // Display the loading overlay when we need it
                onFetchData={this.fetchData} // Request new data when things change
            />
        </Page>;
    }
}
