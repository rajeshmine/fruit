import _ from 'lodash';
import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as InoIcons from 'react-icons/io';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import { getContactList, deleteContactDetails } from 'service/contactService';
import BreadCrumb from 'components/common/forms/BreadCrumb';
import ReactNotification from "react-notifications-component";

export default class ContactList extends Component {

  constructor(props) {
    super(props)
    this.notificationDOMRef = React.createRef();
  }


  state = {
    data: [],
    isTableLoading: true,
  }

  componentDidMount = async () => {
    await this.getContactList();
  }

  getContactList = async () => {
    const res = await getContactList();
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

  getColumnHeaders(prefixUrl = "") {
    let allKeys = ["Email", "Phone No", "Primary Address", "Secondary Address", "Status", "actions"];
    let excludeKeys = [];
    let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v))
    let def = {
      "Email": { dataField: 'email', text: 'Email ', sort: true, },
      "Phone No": { dataField: 'contactNo', text: 'Phone No', sort: true, },
      "Primary Address": { dataField: 'address1', text: 'Primary Address ', sort: true, },
      "Secondary Address": { dataField: 'address2', text: 'Secondary Address ', sort: true, },
      "Status": { dataField: 'contactStatus', text: 'Status ', sort: true, },
      "actions": { dataField: 'actions', isDummyField: true, text: "Actions", formatter: this.actionsFormatter }
    }
    return { "keys": keys, "def": def }
  }

  actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    links.push(<InoIcons.IoIosEye title="View" onClick={() => this.viewFun(`/contact/viewform`, row)} />)
    links.push(<InoIcons.IoMdCreate title="Edit" onClick={() => this.editFun(`/contact/editform`, row)} />)
    links.push(<InoIcons.IoMdTrash title="Delete" onClick={() => this.deleteFun(row)} />)
    return <div className="actions">{links.concat(" ")}</div>
  }

  editFun = async (url, row) => {
    let path = url;
    this.props.props.history.push({
      pathname: path,
      state: { row },
    })
  }

  viewFun = async (url, row) => {
    let path = url;
    this.props.props.history.push({
      pathname: path,
      state: { row },
    })
  }

  deleteFun = async (row) => {
    await this.setState({ isTableLoading: true })
    let response;
    let params = `id=${row.contactId}`
    response = await deleteContactDetails(params)
    if (response.data.statusCode !== 1) return this.addNotification(response.data.message, "danger")
    if (response.data.statusCode === 1) {
      this.addNotification(response.data.message)
      await this.getContactList();
      await this.setState({ isTableLoading: false })
    }
  }

  addNotification(data, type = "success") {
    this.notificationDOMRef.current.addNotification({
      title: `${type} Message`,
      message: data,
      type: type,
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }

  render() {
    const breadCrumbItems = {
      title: "Contact List",
      items: [
        { name: "Home", active: false, link: "/dashboard" },
        { name: "Contact list", active: true },
      ]
    };
    const { data, columns, isTableLoading } = this.state;
    return (
      <React.Fragment >
        <BreadCrumb data={breadCrumbItems} />
        <ReactNotification ref={this.notificationDOMRef} />
        <div className="d-flex justify-content-end">
          <Link to="/contact/addform" >
            <Button size={'sm'} color="primary">
              Add Contact
            </Button>
          </Link>
        </div>
        <div className="clearfix"> </div>
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

