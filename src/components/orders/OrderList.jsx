import React, { PureComponent, Fragment } from 'react';
import BreadCrumb from 'components/common/forms/BreadCrumb';
import { Row, Col } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as InoIcons from 'react-icons/io';
import _ from 'lodash';

import { getAllOrders } from 'service/ordersService';
import 'styles/table.css';

export default class OrderList extends PureComponent {

  state = {
    data: [],
    isTableLoading: true
  }


  componentDidMount = async () => {

    this.getOrederDetails();
  }


  getOrederDetails = async () => {
    const res = await getAllOrders();
    const { data: { statusCode, data } } = res;
    if (!statusCode)
      return this.setState({ data: [], isTableLoading: false })
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
    let allKeys = ["Order Id", "Product Name", "Quantity", "No of Order", "Status", "actions"];
    let excludeKeys = [];
    let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v))
    let def = {
      "Order Id": { dataField: 'orderId', text: 'Order Id', sort: true },
      "Product Name": { dataField: 'productName', text: 'Product Name', sort: true },
      "Quantity": { dataField: 'quantity', text: 'Quantity', sort: true },
      "No of Order": { dataField: 'noOfOrder', text: 'No of Order', sort: true },
      "Status": { dataField: 'deliveryStatus', text: 'Status', sort: true },
      "actions": { dataField: 'actions', isDummyField: true, text: "Actions", formatter: this.actionsFormatter }
    }
    return { "keys": keys, "def": def }
  }

  actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    links.push(<InoIcons.IoIosEye title="View" onClick={() => this.viewFun(`/orders/order-view`, row)} />)
    return <div className="actions">{links.concat(" ")}</div>
  }

  viewFun = async (url, row) => {
    let path = url;
    this.props.props.history.push({
      pathname: path,
      state: { row },
    })
  }

  render() {
    const breadCrumbItems = {
      title: 'Order List',
      items: [
        { name: 'Home', active: false, link: '/dashboard' },
        { name: 'Order List', active: true },
      ]
    };

    const { data, columns } = this.state
    return (
      <Fragment>
        <BreadCrumb data={breadCrumbItems} />
        <Row>
          <Col>
          </Col>
        </Row>
        <div className="clearfix"></div>
        <Row>
          {data && columns &&
            <Col>             
              <div className="table-responsive table-div">
                <BootstrapTable keyField='id'
                  data={data}
                  columns={columns}
                  bootstrap4
                  pagination={paginationFactory()} striped hover condensed               
                  wrapperClasses="table-responsive"
                  noDataIndication={'No data to display here'} />
              </div>
            </Col>
          }
        </Row>
      </Fragment>
    )
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


