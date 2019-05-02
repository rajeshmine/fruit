import React, { PureComponent, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';

import Wishlist from 'components/profile/Wishlist';
import ChangePassword from 'components/profile/Changepassword';
import Details from 'components/profile/Details';
import Orders from 'components/profile/Order';
import Cart from 'components/profile/Cart';
import PaymentStatus from 'components/payment/PaymentStatus';

import Headers from 'components/common/forms/Headers';
import Footers from 'components/common/forms/Footers';


class Profile extends PureComponent {


  frameLoad = () => {
    const { match: { params: { userpageName } } } = this.props;
    switch (userpageName) {
      case 'profile':
        return <Details props={this.props} />
      case 'orders':
        return <Orders props={this.props} />
      case 'cart':
        return <Cart props={this.props} />
      case 'payment':
        return <PaymentStatus props={this.props} />
      case 'wishlist':
        return <Wishlist props={this.props} />
      case 'changepassword':
        return <ChangePassword props={this.props} />

      default:
        return <Details />;
    }
  }

  render() {
    return (
      <Fragment>
        <Headers props={this.props} />
        <Container>
          <Row  >
            <Col md={12} className="login-sec">
              {this.frameLoad()}
            </Col>

          </Row>
        </Container>
        <Footers props={this.props} />
      </Fragment>
    )
  }
}






export default Profile;