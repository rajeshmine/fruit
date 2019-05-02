import React, { PureComponent, Fragment } from 'react'
import _ from 'lodash';
import BreadCrumb from 'components/common/forms/BreadCrumb';
import { Row, Col } from 'reactstrap';
import * as IonIcons from 'react-icons/io';
import DashBox from 'components/common/forms/DashBox';
import { getCategoryList, getDeliveryDetails, getToptenValues } from 'service/dashboardService';

import 'styles/style.css';
import { getAllOrders } from 'service/ordersService';
import CanvasJSReact from 'assets/canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

class Dashboard extends PureComponent {

  state = {
    data: [],
    categoryName: [],
  }

  componentDidMount = async () => {
    this.getCategoryList();
    this.getDeliveryDetails();
    this.getToptenValues();
    this.getOrederDetails();
  }

  getCategoryList = async () => {
    let res = await getCategoryList(), data = [];
    if (res.data.statusCode === 1) {
      data = res.data.data
      await this.setState({
        categoryName: data
      })
    }
  }

  getDeliveryDetails = async () => {
    let res = await getDeliveryDetails();
    if (res.data) {
      await this.setState({
        deliveredCount: res.data.deliveredCount,
        pendingCount: res.data.pendingCount,
        deliveryCounts: res.data
      })
    }
  }

  getToptenValues = async () => {
    let res = await getToptenValues(), data;
    data = res.data.data
    await this.setState({
      topTenProducts: data,
    })
  }

  getOrederDetails = async () => {
    const res = await getAllOrders();
    const { data: { statusCode, data } } = res;
    if (!statusCode)
      return this.setState({ data: [] })
    let completedProducts = await _.filter(data, v => v["deliveryStatus"] === 'Y');
    let inProgressProducts = await _.filter(data, v => v["deliveryStatus"] === 'N');
    await this.setState({ completedProducts: completedProducts, inProgressProducts: inProgressProducts })
  }

  addSymbols(e) {
    var suffixes = ["", "K", "M", "B"];
    var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
    if (order > suffixes.length - 1)
      order = suffixes.length - 1;
    var suffix = suffixes[order];
    return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
  }

  render() {
    let dps = []; let price = [];
    const breadCrumbItems = {
      title: 'Dashboard',
      items: [
        { name: 'Home', active: false, link: '/' },
        { name: 'Dashboard', active: true },
      ]
    };
    const { categoryName, deliveredCount, pendingCount, topTenProducts, deliveryCounts, completedProducts, inProgressProducts } = this.state;
    topTenProducts && topTenProducts.map((c) => {
      dps.push({ y: c.productQuantity, label: c.productName })
      price.push({ y: c.mrp, label: c.productName })
    })
    //console.log(price)
    const Quantityoptions = {
      animationEnabled: true,
      theme: "light2",
      title: {
        // text: "Products Details"
      },
      axisX: {
        title: "Products",
        reversed: true,
      },
      axisY: {
        title: "Quantity",
        labelFormatter: this.addSymbols
      },
      data: [{
        type: "bar",
        dataPoints: dps
      }]
    }
    const Priceoptions = {
      exportEnabled: true,
      animationEnabled: true,
      title: {
        // text: "TopTen Products Details"
      },
      data: [{
        type: "pie",
        startAngle: 25,
        toolTipContent: "<b>{label}</b>: {y} Rs",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 12,
        indexLabel: "{label} - {y} Rs",
        dataPoints: price
      }]
    }
    return (
      <Fragment>
        <BreadCrumb data={breadCrumbItems} />
        {categoryName && <h6>Categories List</h6>}
        <Row>
          <div className="categoryDiv ">
            {categoryName && categoryName.map((c, i) =>
              <DashBox bgClass="fst-div" topic={c.categoryName} value={c.productCount} icon={<IonIcons.IoMdCube />} props={this.props} id={c.categoryId} path={`/dashboard/productdetails`} name={"ProductDetails"} />
            )}
          </div>
        </Row>
        <br />
        {deliveryCounts && <h6>Orders Statistics</h6>}
        <Row>
          {deliveryCounts &&
            <Col md={4} sm={12}>
              <DashBox bgClass="trd-div" topic="Completed" value={deliveredCount} icon={<IonIcons.IoMdDoneAll />} props={this.props} name={"ProductStatus"} path={`/dashboard/productStatus`} data={completedProducts} />
            </Col>}
          {deliveryCounts &&
            <Col md={4} sm={12}>
              <DashBox bgClass="snd-div" topic="In-Process" value={pendingCount} icon={<IonIcons.IoIosTime />} props={this.props} name={"ProductStatus"} path={`/dashboard/productStatus`} data={inProgressProducts} />
            </Col>}
        </Row>
        <br />
        {topTenProducts && <h6>Product Details</h6>}
        <Row>        
          <Col sm={8}>
            {topTenProducts && <CanvasJSChart options={Quantityoptions} />}
          </Col>
          <Col sm={4}>
            {topTenProducts && <CanvasJSChart options={Priceoptions} />}
          </Col>

        </Row>

      </Fragment>
    )
  }
}

export default Dashboard;

