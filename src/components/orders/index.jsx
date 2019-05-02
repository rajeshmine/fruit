
import React, { PureComponent, Fragment } from 'react';

import OrdersList from 'components/orders/OrderList'
// import Statistics from 'components/orders/Statistics'
import ViewOrders from 'components/orders/ViewOrders'

class Orders extends PureComponent {

  frameLoad = () => {
    const { match: { params: { pageName } } } = this.props;
    switch (pageName) {
      case "order-list":
        return <OrdersList props={this.props} />
      case 'order-view':
        return <ViewOrders props={this.props} />
      // case 'order-statistics':
      //   return <Statistics props={this.props} />
      default:
        return;
    }
  }

  render() {
    return (
      <Fragment>
        {this.frameLoad()}
      </Fragment>
    )
  }
}

export default Orders;