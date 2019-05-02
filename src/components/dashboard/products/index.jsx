
import React, { PureComponent, Fragment } from 'react';
import ProductDetails from 'components/dashboard/products/productDetails';

import ViewProductDetails from 'components/dashboard/products/viewProducts';


class ProductStatusDetails extends PureComponent {
    frameLoad = () => {
        const { match: { params: { pageName } } } = this.props;
        switch (pageName) {
            case "productdetails":
                return <ProductDetails props={this.props} />
            case "productStatus":
                return <ProductDetails props={this.props} />
            case "ViewProductStatus":
                return <ViewProductDetails props={this.props} />
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

export default ProductStatusDetails;