import React, { PureComponent, Fragment } from 'react';

import AddUser from 'components/customers/forms/AddUser';  

class CustomerForms extends PureComponent {

  frameLoad = () => {
    const { match: { params: { formType, pageName } } } = this.props;
console.log(pageName)
    switch (pageName) {
      case "details":      
        return <AddUser formType={formType} props={this.props} />; 
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

export default CustomerForms;