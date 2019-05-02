import React, { PureComponent, Fragment } from 'react'


import CatagoryList from 'components/catalog/CatagoryList';
import ProductList from 'components/catalog/ProductList';
import OfferList from 'components/catalog/OfferList';

class Catalog extends PureComponent {


  async componentWillMount() {
    // console.log(this.props)
  }

  frameLoad = () => {
    const { match: { params: { pageName } } } = this.props;
    switch (pageName) {
      case 'categories':
        return <CatagoryList props={this.props} />
      case 'products':
        return <ProductList  props={this.props} />
      case 'offers':
        return <OfferList  props={this.props} />
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

export default Catalog;