import React, { PureComponent, Fragment } from 'react'

import { Container, Row, Col } from 'reactstrap'

class PaymentStatus extends PureComponent {
  componentDidMount = () => {
    console.log(this.props)
  }

  paymentSummery = () => {
    const { props: { location: { state } } } = this.props;
    return <div className="payment-summery">
      <p className="payment-title">Payment Summery</p>
      <div className="info-div">
        <p> Your Order No is<span>{state[0]["orderId"][0]}</span></p>
        <p>Ordered Date<span>{state[0]["orderDate"]}</span></p>
        <p>GST<span>₹ {state[0]["gstAmount"]}</span></p>
        <p>Net Amount<span>₹ {(+state[0]["netAmount"]) - (+state[0]["gstAmount"])}</span></p>
        <p className="divider" style={{ borderTop: "1px solid" }}> </p>
        <p>Order Total<span style={{ fontWeight: 500, color: "#333" }}>₹ {state[0]["netAmount"]}</span></p>
      </div>
    </div>
  }

  render() {
    return (
      <Fragment>
        <h2 className="text-center">Order Status</h2>
        <Container>
          <Row>
            <Col md={7} className="d-flex justify-content-center align-content-center text-center flex-column">
              <img src="https://www.roadmap-planner.io/static/img/icon_done.svg" alt="Success Info" className="img-fluid" />
              <p className="text-success">Payment Success ... </p>
            </Col>
            <Col md={5}>
              {this.paymentSummery()}
            </Col>
          </Row>
        </Container>
      </Fragment>
    )
  }
}

export default PaymentStatus;