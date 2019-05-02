import React, { PureComponent, Fragment } from 'react';
import { Button } from 'reactstrap';

import _ from 'lodash';
import ReactNotification from "react-notifications-component";


import { placeOrder } from 'service/ordersService'

import 'styles/forms.css'

class Payment extends PureComponent {


  constructor(props) {
    super(props)
    this.notificationDOMRef = React.createRef();
  }

  state = {
    transactionStatus: "",
    orderId: "",
    paymentMode: "",
    failureReason: ""
  }

  componentDidMount = () => {
    console.log(this.props)
  }

  paymentLoad = () => {
    const { data: { netAmount, email, mobileno } } = this.props;
    return <iframe title="Payment" id="paymentFrame" ref={"paymentFrame"} className="payment-frame" src={`http://localhost:3002/about?amt=${netAmount}&email=${email}&mobileno=${mobileno}`} onLoad={this.iframeLoad}>
    </iframe>
  }

  iframeLoad = async (e) => {
    var ipath = document.getElementById("paymentFrame");
    const htmlcont = ipath.contentWindow.document.body.innerHTML;
    const frameURL = ipath.contentWindow.location.href;
    if (frameURL === 'http://localhost:3002/ccavRequestHandler') {
    }
    if (frameURL === 'http://localhost:3002/ccavResponseHandler') {
      let obj = {
        "deliveryStatus": "N",
        "deliveredTime": "0000-00-00 00:00:00",
        "deliveredBy": "",
        "deliveredTo": "",

        "cancellationFlag": "Y",
        "cancellationReason": htmlcont.split('&amp;')[8].split('=')[1],
        "paymentMode": "COD" || '',

        "transactionStatus": htmlcont.split('&amp;')[3].split('=')[1] === "Aborted" ? "N" : "S",
        "failureReason": htmlcont.split('&amp;')[4].split('=')[1] || '',
      }
      // "paymentMode": "htmlcont.split('&amp;')[5].split('=')[1]" || '',
      if (htmlcont.split('&amp;')[3].split('=')[1] !== "Aborted")
        return this.payloadForm(obj);
      this.addNotification("Order was canceled", "danger")
      return this.redirectTo({}, "back")
    }
  }



  payloadForm = async (payment = {}) => {
    let { data } = this.props;
    await _.assign(data, payment)
    await this.placeOrder(data)
  }

  placeOrder = async (payload) => {
    try {
      const res = await placeOrder(payload);
      const { data: { statusCode, data } } = res;
      if (statusCode) {
        this.addNotification("Order was Placed Successfully")
        return this.redirectTo(data, "forward")
      }
      return this.addNotification("Something went wrong please try again after some time", "danger");
    } catch (err) {
      console.log(err)
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


  redirectTo = (data = {}, direction = "back") => {
    const { props } = this.props;
    if (direction === 'back')
      return props.history.back();
    return props.history.push({
      pathname: '/userdetails/payment',
      state: data
    });
  }


  render() {
    const { handleBack } = this.props;
    return (
      <Fragment>
        <ReactNotification ref={this.notificationDOMRef} />

        {this.paymentLoad()}
        <Button onClick={() => handleBack()} size={"sm"} > Back</Button>
      </Fragment>
    )
  }
}


export default Payment;