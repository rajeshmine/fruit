import React, { PureComponent, Fragment } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BreadCrumb from 'components/common/forms/BreadCrumb';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as InoIcons from 'react-icons/io';
import _ from 'lodash';

import { BannerDetails, deleteBanners } from 'service/bannerService';
import ReactNotification from "react-notifications-component";

class BannerList extends PureComponent {

  constructor(props) {
    super(props)
    this.notificationDOMRef = React.createRef();
  }

  state = {
    data: [],
    isTableLoading: true
  }


  componentDidMount = async () => {
    await this.getBanners();
  }

  getBanners = async () => {
    const res = await BannerDetails();
    const { data: { statusCode, data } } = res;
    if (!statusCode)
      return this.setState({ data: [], isTableLoading: false });
    await this.setState({ data, isTableLoading: false });
    await this.initTableData()
  }

  initTableData = async () => {
    const { hideColumns } = this.state;
    const columnHeaders = this.getColumnHeaders(this.props.prefixUrl);
    const columns = getColumns(columnHeaders, hideColumns);
    await this.setState({ columns, columnHeaders, hideColumns })
  }


  getColumnHeaders(prefixUrl = "") { //dynamic headers 
    let allKeys = ["S.No", "Banner Id", "Banner", "Description", "Status", "actions"];
    let excludeKeys = [];
    let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v))
    let def = {
      "S.No": { dataField: 'id', text: 'S.No', sort: true, formatter: sNoFormater },
      "Banner Id": { dataField: 'imageId', text: 'Banner Id', sort: true },
      "Banner": { dataField: 'imageURL', text: 'Banner', formatter: imageFormater },
      "Description": { dataField: 'imageDescription', text: 'Description', sort: true },
      "Status": { dataField: 'imageStatus', text: 'Status', sort: true },
      "actions": { dataField: 'actions', isDummyField: true, text: "Actions", formatter: this.actionsFormatter }
    }
    return { "keys": keys, "def": def }
  }

  actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
    let links = [];
    links.push(<InoIcons.IoMdCreate title="Edit" onClick={() => this.editFun(`/banner/edit`, row)} />)
    links.push(<InoIcons.IoMdTrash title="Delete" onClick={() => this.deleteFun(row)} />)
    return <div className="actions">{links.concat(" ")}</div>
  }

  deleteFun = async (row) => {
    await this.setState({ isTableLoading: true })
    let params = `imgId=${row.imageId}`
    let response = await deleteBanners(params)
    if (response.data.statusCode !== 1) return this.addNotification(response.data.data, 'danger')
    if (response.data.statusCode === 1) {
      this.addNotification(response.data.data)
      await this.getBanners();
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

  editFun = async (url, row) => {
    let path = url;
    this.props.props.history.push({
      pathname: path,
      state: { row },
      formType: "edit"
    })
  }

  render() {
    const { isTableLoading, data, columns } = this.state;
    const breadCrumbItems = {
      title: "Banner List",
      items: [
        { name: "Home", active: false, link: "/dashboard" },
        { name: "Banner list", active: true },
      ]
    };


    return (
      <Fragment>
        <BreadCrumb data={breadCrumbItems} />
        <ReactNotification ref={this.notificationDOMRef} />
        <br />
        <div className="d-flex justify-content-end">
          <Link to="/banner/upload">
            <Button size={'sm'} color="primary">
              Upload Banner
            </Button>
          </Link>
        </div>
        <div className="clearfix"> </div>
        {
          !isTableLoading && data && columns &&
          <div className="table-responsive table-div">
            <BootstrapTable keyField='imageId'
              data={data}
              columns={columns}
              bootstrap4
              pagination={paginationFactory()} striped hover condensed />
          </div>
        }
      </Fragment>
    )
  }
}

export default BannerList;

let i = 1;
function sNoFormater(cell, row, rowIndex, formatExtraData) {
  return i++;
}

function imageFormater(cell, row, rowIndex, formatExtraData) {
  return <img className="img-thumbnail" src={cell} alt="Hello" style={{ height: '50px' }} />
}

function getColumns(columnsHeaders, hideColumns) {
  let columns = []
  const { keys, def } = columnsHeaders;

  _.forEach(keys, (key) => {
    columns.push({ ...def[key], hidden: _.includes(hideColumns, key) })
  })
  return columns;
}