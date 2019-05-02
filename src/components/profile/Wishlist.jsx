import React, { PureComponent, Fragment } from 'react'
import BreadCrumb from 'components/common/forms/BreadCrumb';
import _ from 'lodash';
import { getWishList, removeWishList, addtoCart } from 'service/profileService'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as InoIcons from 'react-icons/io';
import 'styles/style.css';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

import { getJwt, storeData } from 'service/authService';



class Wishlist extends PureComponent {

  state = {
    data: {},
    isTableLoading: true
  }


  constructor(props) {
    super(props);
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  componentDidMount = async () => {
    await this.getUserInfo();
    await this.wishlist()
  }

  addNotification(data) {
    console.log(data)
    this.notificationDOMRef.current.addNotification({
      title: "Success Message",
      message: data,
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }

  async wishlist() {
    const { uid } = this.state;
    let params = `userId=${uid}`
    console.log(params)
    let res = await getWishList(params)
    console.log(res)
    if (res.data.statusCode === 1) {
      await this.setState({ wishListDetails: res.data.data, isTableLoading: false })
      this.initTableData()
    } else {
      await this.setState({ wishListDetails: [], isTableLoading: false })
    }
  }

  getColumnHeaders(prefixUrl = "") { //dynamic headers 
    let allKeys = ["Items", "Description", "Add to Cart", "Remove"];
    let excludeKeys = [];
    let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v))
    let def = {
      "Items": { dataField: 'productName', text: 'Items', sort: true, formatter: imageFormater },
      "Description": { dataField: 'imageDescription', text: 'Description', formatter: this.descFormatter },
      "Add to Cart": { dataField: 'transactionStatus', text: 'Add to Cart', formatter: this.cartFormatter },
      "Remove": { dataField: 'actions', isDummyField: true, text: "Remove", formatter: this.actionsFormatter }
    }
    return { "keys": keys, "def": def }
  }

  actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    links.push(<InoIcons.IoMdTrash style={{ color: 'red' }} title="delete" onClick={() => this.deleteFun(row)} />)
    return <div className="actions">{links.concat(" ")}</div>
  }

  cartFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    links.push(<button type="button" className="btn btn-default" id="cardbtn1" onClick={() => this.addToCart(row)}><i className="fa fa-plus"  ></i><i className="fa fa-shopping-cart" style={{ margin: '5px' }}></i></button>)
    return <div className="actions">{links.concat(" ")}</div>
  }

  descFormatter(cell, row, rowIndex, formatExtraData) {
    let links = [];
    links.push(<div><h3 id="h3heading9">{row.productName}</h3>
      <span id="showrupeecolor"><i className="fa fa-rupee"></i> {row.sellingPrice}</span>
      <span id="hiderupeecolor"><i className="fa fa-rupee"></i> {row.mrp}</span>
      <span id="gmscolor"> {row.quantity} {row.productUom}</span><br /><br /></div>)
    return <div className="actions">{links.concat(" ")}</div>
  }

  async deleteFun(data) {
    let params = `wishlistId=${data.wishlistId}`
    console.log(params)
    let res = await removeWishList(params)
    console.log(res)
    if (res.data.statusCode !== 1) return this.addNotification(res.data.message);

    if (res.data.statusCode === 1) {
      this.addNotification(res.data.message);
      this.wishlist();
    }
  }

  getUserInfo = async () => {
    let res = await getJwt('__info');
    const { uid } = res;
    await this.setState({ uid: uid, userInfo: res });
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
    if (res.data.statusCode !== 1) return this.addNotification(res.data.message);
    if (res.data.statusCode === 1) return this.addNotification(res.data.message);


  }


  initTableData = async () => {
    const { hideColumns } = this.state;
    const columnHeaders = this.getColumnHeaders(this.props.prefixUrl);
    const columns = getColumns(columnHeaders, hideColumns);
    await this.setState({ columns, columnHeaders, hideColumns })
  }

  render() {
    const { isTableLoading, wishListDetails, columns } = this.state;

    const breadCrumbItems = {
      title: 'Wishlist',
      items: [
        { name: 'Profile', active: false, link: '/' },
        { name: 'Wishlist', active: true },
      ]
    };

    return (
      <Fragment>
        <BreadCrumb data={breadCrumbItems} />
        <ReactNotification ref={this.notificationDOMRef} />
        {
          !isTableLoading && wishListDetails && columns &&
          <div className="table-responsive table-div">
            <BootstrapTable keyField='orderId'
              data={wishListDetails}
              columns={columns}
              bootstrap4
              pagination={paginationFactory()} striped hover condensed />
          </div>
        }
      </Fragment>
    )
  }
}

export default Wishlist;


function getColumns(columnsHeaders, hideColumns) {
  let columns = []
  const { keys, def } = columnsHeaders;

  _.forEach(keys, (key) => {
    columns.push({ ...def[key], hidden: _.includes(hideColumns, key) })
  })
  return columns;
}

function imageFormater(cell, row, rowIndex, formatExtraData) {
  return <img className="img-thumbnail" src={row.imageUrl} alt="Hello" style={{ height: '100px' }} />
}