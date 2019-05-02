import React, { PureComponent, Fragment } from 'react'
import { Row, Col } from 'reactstrap';

import 'styles/userstyle.css';
import { addtoCart, addtoWishlist } from 'service/profileService';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import Card from './../../common/forms/Card';
import { getJwt, storeData } from 'service/authService';


class UserDashboard extends PureComponent {

  componentDidMount = async() => {
    await this.getUserInfo();
  }

  constructor(props) {
    super(props);
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  getUserInfo = async () => {
    let res = await getJwt('__info');
    console.log(res)
    if (res) {
      const { uid } = res;
    await this.setState({ uid: uid, userInfo: res });

    }
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

  addtoCart = async (data) => {
    console.log(data)
    const {uid} = this.state

    let res = ''
    let postData = {
      "userId": uid,
      "productId": data.productId,
      "categoryId": data.categoryId,
      "quantity": data.quantity,
      "productUom": data.productUomId,
      "noOfOrder": "1"
    }
    console.log(postData)

    res = await addtoCart(postData)
    console.log(res)
    if (res.data.statusCode !== 1) return this.addNotification(res.data.message);
    if (res.data.statusCode === 1) {
      this.addNotification(res.data.message)
    }
  }

  addtoWishlist = async (data) => {
    console.log(data)
    const {uid} = this.state
    let res = ''
    let postData = {
      "userId":uid ,
      "productId": data.productId,
      "quantity": data.quantity,
      "productUom": data.productUomId
    }

    console.log(postData)
    res = await addtoWishlist(postData)
    console.log(res)
    if (res.data.statusCode === 1) {       
      this.addNotification(res.data.message)
    }
  }


  render() {
    const { data: productDetails } = this.props
    console.log(productDetails)
    return (
      <Fragment>
        <ReactNotification ref={this.notificationDOMRef} />


        <Row style={{ marginTop: '20px' }}>

          {productDetails && productDetails.map((c, i) =>
            <Col md={3} sm={12} key={i}>
              <Card prodname={c.productName} fixprice={c.sellingPrice} offerprice={c.mrp} prodcount={c.productUomId + c.productUom} imgsource={c.image} >

              </Card>
              <div className="row text-center" style={{ marginTop: '-50px' }}>
                <div className="col-md-12">
                  <button type="button" className="btn btn-default" id="cardbtn1"
                    onClick={() => this.addtoCart(c)} >
                    <i className="fa fa-plus" ></i> <i className="fa fa-shopping-cart" ></i> </button>
                  <button type="button" className="btn btn-default" id="cardbtn2" onClick={() => this.addtoWishlist(c)} ><i className="fa fa-heart" ></i></button>
                </div>
              </div>
            </Col>
          )}

        </Row>

        {
          productDetails.length === 0 &&
          <Row style={{ marginTop: '100px' }}>
            <Col md={4}></Col>
            <Col md={4}>

              <div className="mycard">No Data Found</div>

            </Col>
            <Col md={4}></Col>

          </Row>
        }
      </Fragment>
    )
  }

}

export default UserDashboard;