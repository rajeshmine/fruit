
import React, { PureComponent, Fragment } from 'react';

import UserDetails from 'components/customers/UserDetails';
import UserFeedBack from 'components/customers/FeedBack';

class Customers extends PureComponent {

  frameLoad = () => {
    const { match: { params: { pageName } } } = this.props;
    switch (pageName) {
      case "details":
        return <UserDetails props={this.props} />
      case 'feedback':
        return <UserFeedBack props={this.props} />
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

export default Customers;