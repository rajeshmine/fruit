
import _ from 'lodash';
import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as InoIcons from 'react-icons/io';
import { getFeedbacks, deleteUserFeedback } from 'service/customerService';
import BreadCrumb from 'components/common/forms/BreadCrumb';
import ToastService from '../../service/toastService';


export default class CatagoryList extends Component {

  state = {
    data: [],
    isTableLoading: true,
  }

  componentDidMount = async () => {
    await this.getFeedbacks();
  }

  getFeedbacks = async () => {
    const res = await getFeedbacks();
    const { data: { statusCode, data } } = res;
    if (!statusCode)
      return this.setState({ data: [], isTableLoading: false });
    await this.setState({ data, isTableLoading: false })
    await this.initTableData()
  }

  initTableData = async () => {
    const { hideColumns } = this.state;
    const columnHeaders = this.getColumnHeaders(this.props.prefixUrl);
    const columns = getColumns(columnHeaders, hideColumns);
    await this.setState({ columns, columnHeaders, hideColumns })
  }

  getColumnHeaders(prefixUrl = "") { //dynamic headers 
    let allKeys = ["userId", "Rating", "Comments", "actions"];
    let excludeKeys = [];
    let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v))
    let def = {
      "userId": { dataField: 'userId', text: 'userId', sort: true, },
      "Rating": { dataField: 'ratings', text: ' Rating ', sort: true, formatter: this.ratingFormater },
      "Comments": { dataField: 'comments', text: 'Comments', sort: true, },
      "actions": { dataField: 'actions', isDummyField: true, text: "Actions", formatter: this.actionsFormatter }
    }
    return { "keys": keys, "def": def }
  }

  actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    links.push(<InoIcons.IoMdTrash title="Delete" onClick={() => this.deleteFun(row)} />)
    return <div className="actions">{links.concat(" ")}</div>
  }

  ratingFormater(cell, row, rowIndex, formatExtraData) {
    return _.fill(Array(cell)).map((v, i) => <InoIcons.IoIosStar />);
  }

  deleteFun = async (row) => {
    await this.setState({ isTableLoading: true })
    let response;
    let params = `feedbackId=${row.feedbackId}`
    response = await deleteUserFeedback(params)
    if (response.data.statusCode !== 1) return ToastService.Toast(response.data.data, 'default');
    if (response.data.statusCode === 1) {
      await ToastService.Toast(response.data.data, 'default');
      await this.getFeedbacks();
      await this.setState({ isTableLoading: false })
    }
  }

  render() {
    const breadCrumbItems = {
      title: 'User FeedBack',
      items: [
        { name: 'Home', active: false, link: '/dashboard' },
        { name: 'User FeedBack', active: true },
      ]
    };
    const { data, columns, isTableLoading } = this.state;
    return (
      <React.Fragment >
        <BreadCrumb data={breadCrumbItems} />
        {data && columns && !isTableLoading &&
          <BootstrapTable
            keyField="categoryId"
            data={data}
            columns={columns}
            bootstrap4
            pagination={paginationFactory()} striped hover condensed
            classes="table table-bordered table-hover table-sm"
            wrapperClasses="table-responsive"
            noDataIndication={'No data to display here'}
          />
        }
      </React.Fragment>)
  }
}

function getColumns(columnsHeaders, hideColumns) {
  let columns = []
  const { keys, def } = columnsHeaders;

  _.forEach(keys, (key) => {
    columns.push({ ...def[key], hidden: _.includes(hideColumns, key) })
  })
  return columns;
}

