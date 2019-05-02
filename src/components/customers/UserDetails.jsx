import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { Button, Row, Col } from 'reactstrap';
import * as InoIcons from 'react-icons/io';
import 'styles/table.css';
import { Link } from 'react-router-dom';
import { getUserDetails, deleteUserDetails } from 'service/customerService';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BreadCrumb from 'components/common/forms/BreadCrumb';
import ReactNotification from "react-notifications-component";

export default class UserDetails extends PureComponent {

  constructor(props) {
    super(props)
    this.notificationDOMRef = React.createRef();
  }

  state = {
    data: [],
    isTableLoading: true,
    isEmployee: false,
    isUser: true
  }

  componentDidMount = async () => {
    await this.getUserDetails();
  }

  getUserDetails = async () => {
    const res = await getUserDetails();
    const { data: { statusCode, data } } = res;
    if (!statusCode)
      return this.setState({ data: [], isTableLoading: false });
    await this.setState({ data, isTableLoading: false })
    let temp = await _.filter(this.state.data, v => v["userRole"] === 'D');
    await this.setState({ deliverBoys: temp })
    let temp1 = await _.filter(this.state.data, v => v["userRole"] === 'U');
    await this.setState({ regUsers: temp1 })
    await this.initTableData()
  }

  initTableData = async () => {
    const { hideColumns } = this.state;
    const columnHeaders = this.getColumnHeaders(this.props.prefixUrl);
    const columns = this.getColumns(columnHeaders, hideColumns);
    await this.setState({ columns, columnHeaders, hideColumns })
  }

  getColumnHeaders(prefixUrl = "") { //dynamic headers 
    let allKeys = ["S.No", "userId", "userName", "email", "phone", "actions"];
    let excludeKeys = [];
    if (this.state.isUser) {
      excludeKeys = ["actions"]
    }

    let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v))
    let def = {
      "S.No": { dataField: 'sno', isDummyField: true, text: "S.No", formatter: this.serialNumberFormatter },
      "userId": { dataField: 'userId', text: 'userId ', sort: true, },
      "userName": { dataField: 'userName', text: 'userName ', sort: true, },
      "email": { dataField: 'email', text: 'email ', sort: true, },
      "phone": { dataField: 'phone', text: 'phone ', sort: true, },
      "actions": { dataField: 'actions', isDummyField: true, text: "Actions", formatter: this.actionsFormatter }
    }
    return { "keys": keys, "def": def }
  }

  actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    links.push(<InoIcons.IoMdCreate title="Edit" onClick={() => this.editFun(`/customer/details/edit`, row)} />)
    links.push(<InoIcons.IoMdTrash title="Delete" onClick={() => this.deleteFun(row)} />)
    return <div className="actions">{links.concat(" ")}</div>
  }

  editFun = async (url, row) => {
    let path = url;
    this.props.props.history.push({
      pathname: path,
      state: { row }
    })
  }

  deleteFun = async (row) => {
    await this.setState({ isTableLoading: true })
    let response;
    let params = `userId=${row.userId}`
    response = await deleteUserDetails(params)
    if (response.data.statusCode !== 1) return this.addNotification(response.data.message, 'danger')
    if (response.data.statusCode === 1) {
      this.addNotification(response.data.message)
      await this.getUserDetails();
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

  getColumns(columnsHeaders, hideColumns) {
    let columns = []
    const { keys, def } = columnsHeaders;

    _.forEach(keys, (key) => {
      columns.push({ ...def[key], hidden: _.includes(hideColumns, key) })
    })
    return columns;
  }

  serialNumberFormatter(cell, row, rowIndex, colIndex, formatExtraData) {
    return rowIndex + 1
  }

  async navigatetoEmployee() {
    const { deliverBoys } = this.state
    if (deliverBoys && deliverBoys.length > 0) {
      await this.setState({ isEmployee: true, isUser: false })
      await this.initTableData()
    }
  }

  async navigatetoUser() {
    const { regUsers } = this.state
    if (regUsers && regUsers.length > 0) {
      await this.setState({ isEmployee: false, isUser: true })
      await this.initTableData()

    }
  }

  render() {
    const { isTableLoading, columns, deliverBoys, isEmployee, isUser, regUsers } = this.state;
    const breadCrumbItems = {
      title: 'User Details',
      items: [
        { name: 'Home', active: false, link: '/dashboard' },
        { name: 'User Details', active: true },
      ]
    };

    return (
      <Fragment>
        <BreadCrumb data={breadCrumbItems} />
        <ReactNotification ref={this.notificationDOMRef} />
        <div>
          <Row>
            <Col sm={6}>
              <Button size={'sm'} color="primary" onClick={() => this.navigatetoUser()} >
                User
            </Button>
              <Button size={'sm'} color="primary" style={{ marginLeft: '5px' }} onClick={() => this.navigatetoEmployee()}>
                Employee
            </Button>
            </Col>
          </Row>
        </div>
        {
          isEmployee &&
          <div className="d-flex justify-content-end">
            <Link to="/customer/details/add">
              <Button size={'sm'} color="primary">
                Add Employee
                </Button>
            </Link>
          </div>
        }
        <div className="clearfix"> </div>
        {!isTableLoading && isUser && regUsers && columns &&
          <div className="table-responsive table-div">
            <BootstrapTable keyField='userId' data={regUsers} columns={columns} bootstrap4 pagination={paginationFactory()} striped hover condensed />
          </div>
        }
        {!isTableLoading && isEmployee && deliverBoys && columns &&
          <div className="table-responsive table-div">
            <BootstrapTable keyField='userId' data={deliverBoys} columns={columns} bootstrap4 pagination={paginationFactory()} striped hover condensed />
          </div>
        }
      </Fragment>
    )
  }
}


