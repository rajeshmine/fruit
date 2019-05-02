import _ from 'lodash';
import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as InoIcons from 'react-icons/io';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import { getAllProducts, deleteProduct } from 'service/catalogService'
import BreadCrumb from 'components/common/forms/BreadCrumb';
import ReactNotification from "react-notifications-component";

export default class ProductList extends Component {

  constructor(props) {
    super(props)
    this.notificationDOMRef = React.createRef();
  }

  state = {
    data: [],
    isTableLoading: true,
  }

  componentDidMount = async () => {
    await this.getProductDetails();
  }

  getProductDetails = async () => {
    const res = await getAllProducts();
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
    let allKeys = ["Category Id", "Product Name", "Product Image", "Quantity", "Uom", "MRP(Rs)", "Selling Price(Rs)", "Status", "actions"];
    let excludeKeys = [];
    let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v))
    let def = {
      "Category Id": { dataField: 'categoryId', text: 'Category Id ', sort: true, },
      "Product Name": { dataField: 'productName', text: 'Product Name ', sort: true, },
      "Product Image": { dataField: 'image', text: 'Product Image', formatter: imageFormater, sort: true, },
      "Description": { dataField: 'description', text: 'Description ', sort: true, },
      "Quantity": { dataField: 'productQuantity', text: 'Quantity ', sort: true, },
      "Uom": { dataField: 'productUom', text: 'Uom ', sort: true, },
      "MRP(Rs)": { dataField: 'mrp', text: 'MRP(Rs) ', sort: true, },
      "Selling Price(Rs)": { dataField: 'sellingPrice', text: 'Selling Price(Rs) ', sort: true, },
      "Status": { dataField: 'productStatus', text: 'Status', sort: true, },
      "actions": { dataField: 'actions', isDummyField: true, text: "Actions", formatter: this.actionsFormatter }
    }
    return { "keys": keys, "def": def }
  }

  actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    links.push(<InoIcons.IoMdCreate title="Edit" onClick={() => this.editFun(`/catalog/product/edit`, row)} />)
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
    let params = `productId=${row.productId}`
    response = await deleteProduct(params)
    if (response.data.statusCode !== 1) return this.addNotification(response.data.message, 'danger')
    if (response.data.statusCode === 1) {
      this.addNotification(response.data.message)
      await this.getProductDetails();
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
      title: "Products",
      items: [
        { name: "Home", active: false, link: "/dashboard" },
        { name: "Products", active: true },
      ]
    };
    const { data, columns, isTableLoading } = this.state;

    return (
      <React.Fragment >
        <BreadCrumb data={breadCrumbItems} />
        <ReactNotification ref={this.notificationDOMRef} />
        <div className="d-flex justify-content-end">
          <Link to="/catalog/product/add">
            <Button size={'sm'} color="primary">
              Add Product
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

function imageFormater(cell, row, rowIndex, formatExtraData) {
  return <img className="img-thumbnail" src={cell} alt="Hello" style={{ height: '50px' }} />
}

