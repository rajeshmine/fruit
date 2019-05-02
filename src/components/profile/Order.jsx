import React, { PureComponent, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import BreadCrumb from 'components/common/forms/BreadCrumb';
import { addtoCart } from 'service/profileService'

import paginationFactory from 'react-bootstrap-table2-paginator';
 
import _ from 'lodash';
import 'styles/style.css';

import { getOrderbyId } from 'service/ordersService'


class Orders extends PureComponent {

  state = {
    isTableLoading: true
  }

  async componentDidMount() {
    let params = `userId=19`
    let res = await getOrderbyId(params)
    console.log(res)
    if (res.data.statusCode === 1) {
      await this.setState({ myOrders: res.data.data, isTableLoading: false })
      await this.initTableData()
      console.log(this.state.myOrders)
    } else {
      await this.setState({ myOrders: [], isTableLoading: false })
    }
  }

  getColumnHeaders(prefixUrl = "") { //dynamic headers 
    let allKeys = ["Order ID", "Items", "Description", "Status", "Delivery Date", "actions"];
    let excludeKeys = [];
    let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v))
    let def = {
      "Order ID": { dataField: 'orderId', text: 'Order ID', sort: true, formatter: this.orderFormatter },
      "Items": { dataField: 'productUrl', text: 'Items', sort: true, formatter: imageFormater },
      "Delivery Date": { dataField: 'deliveredDate', text: 'Delivery Date', },
      "Description": { dataField: 'productName', text: 'Description', sort: true },
      "Status": { dataField: 'transactionStatus', text: 'Status', sort: true },
      "actions": { dataField: 'actions', isDummyField: true, text: "Action", formatter: this.actionsFormatter }
    }
    return { "keys": keys, "def": def }
  }



  initTableData = async () => {
    const { hideColumns } = this.state;
    const columnHeaders = this.getColumnHeaders(this.props.prefixUrl);
    const columns = getColumns(columnHeaders, hideColumns);
    await this.setState({ columns, columnHeaders, hideColumns })
  }

  actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    links.push(<button type="button" class="btn btn-default" onClick={() => this.addToCart(row)} id="reorderbtn1"><i class="fa fa-plus"
      style={{ margin: "5px" }}></i><i class="fa fa-shopping-basket"></i>

    </button>)
    return <div className="actions">{links.concat(" ")}</div>
  }
  orderFormatter = (cell, row, rowIndex, formatExtraData) => {
    console.log(row)
    let links = [];
    links.push(<div> <p id="footerparagraph">{row.orderId}</p>
      <p id="footerparagraph">{row.orderDate}</p></div>)
    return <div className="actions">{links.concat(" ")}</div>
  }


  async addToCart(data) {    
    const { userId, productId, categoryId, quantity, productUom } = data
    let payload =
    {
      "userId": userId,
      "productId": productId,
      "categoryId": categoryId,
      "quantity": quantity,
      "productUom": productUom,
      "noOfOrder": "1"
    }
    console.log(payload)
    const res = await addtoCart(payload)
    console.log(res)
    if(res.data.statusCode === 1){
        alert(res.data.message)
    }
  }



  render() {

    const { isTableLoading, myOrders, columns } = this.state;

    const breadCrumbItems = {
      title: 'My Orders',
      items: [
        { name: 'Home', active: false, link: '/' },
        { name: 'My Orders', active: true },
      ]
    };

    return (
      <Fragment>
        <BreadCrumb data={breadCrumbItems} />
        <div className="container">
          {myOrders &&
            <div className="row" >
              <div className="col-md-7 cartcolumnpadding1">
                <h3 id="h3heading10">YOUR ORDERS ({myOrders.length})</h3>
              </div>
            </div>
          }

          {
            !isTableLoading && myOrders && columns &&
            <div className="table-responsive table-div">

              <BootstrapTable keyField='orderId'
                data={myOrders}
                columns={columns}
                bootstrap4
                pagination={paginationFactory()} striped hover condensed />
            </div>
          }
        </div>
      </Fragment>
    )
  }
}




export default Orders;

function getColumns(columnsHeaders, hideColumns) {
  let columns = []
  const { keys, def } = columnsHeaders;

  _.forEach(keys, (key) => {
    columns.push({ ...def[key], hidden: _.includes(hideColumns, key) })
  })
  return columns;
}


function imageFormater(cell, row, rowIndex, formatExtraData) {
  return <img className="img-thumbnail" src={row.productUrl} alt="Hello" style={{ height: '100px' }} />
}