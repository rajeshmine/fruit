import React, { PureComponent, Fragment } from 'react';
import BreadCrumb from 'components/common/forms/BreadCrumb';
import { Row, Col } from 'reactstrap';
import { Form } from 'informed';

import { Input } from "components/common/forms/Input";
import { Textarea } from 'components/common/forms/textarea';
import { CustomSelect } from "components/common/forms/custom-select";
import { updateOrders } from '../../service/ordersService'
import ReactNotification from "react-notifications-component";
import 'styles/table.css';

export default class ViewOrders extends PureComponent {

    constructor(props) {
        super(props)
        this.notificationDOMRef = React.createRef();
    }

    state = {
        productUrl: '',
        status: [{ id: "Y", name: "Active" }, { id: "N", name: "InActive" },]
    }

    componentDidMount() {
        const { location: { state } } = this.props.props;
        return this.formStateCheck(state.row);
    }

    formStateCheck = async (data) => {
        await this.setState({ data, productUrl: data.productUrl });
        try {
            await this.formApi.setValues(data);
        } catch (err) { }
    }

    setFormApi = formApi => {
        this.formApi = formApi;
    };

    handleChange = async ({ currentTarget: Input }) => {
        const { name, value } = Input;
        const { data } = this.state;
        data[name] = value;
        await this.setState({
            [name]: value
        })
    }

    onSubmit = async () => {
        let response;
        const data = this.formApi.getState().values;
        const { productUrl } = this.state
        data['productUrl'] = productUrl
        let Data = {
            "deliveryStatus": data.deliveryStatus,
            "deliveredTime": data.deliveredTime,
            "deliveredBy": data.deliveredBy,
            "deliveredTo": data.deliveredTo,
            "userId": data.userId,
            "orderId": data.orderId,
        }
        response = await updateOrders(Data)
        if (response.data.statusCode !== 1) return this.addNotification(response.data.message, "danger")
        if (response.data.statusCode === 1) {
            this.addNotification(response.data.message)
            this.redirectTo()
        }
    }

    redirectTo = async () => {
        let path = `/orders/order-list`
        this.props.props.history.push({
            pathname: path,
        })
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

    render() {
        const { productUrl } = this.state
        const breadCrumbItems = {
            title: 'Order Views',
            items: [
                { name: 'Home', active: false, link: '/dashboard' },
                { name: 'Order List', active: false, link: '/orders/order-list' },
                { name: 'Order Views', active: true },
            ]
        };
        return (
            <Fragment>
                <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
                    {({ formApi, formState }) => (
                        <div>
                            <BreadCrumb data={breadCrumbItems} />
                            <ReactNotification ref={this.notificationDOMRef} />
                            <Row className="form-div">
                                <Col md={12} sm={12} >
                                    <img className="img-thumbnail" id="output_image" src={productUrl} alt="Orders" style={{ height: "100px" }}></img>
                                </Col>
                                <Col md={3} sm={12}>
                                    <Input
                                        field="categoryId" label="Category Id" name="categoryId" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="categoryName" label="Category Name" name="categoryName" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="productId" label="Product Id" name="productId" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="productName" label="Product Name" name="productName" readOnly
                                    />
                                </Col>
                                <Col md={6} sm={12} >
                                    <Textarea field="address" label="Address" name="address" readOnly />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="city" label="City" name="city" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="pincode" label="Pincode" name="pincode" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="orderId" label="Order Id" name="orderId" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="noOfOrder" label="NoOf Order" name="noOfOrder" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="orderDate" label="Order Date" name="orderDate" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="quantity" label="Quantity" name="quantity" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="totalAmount" label="Total Amount" name="totalAmount" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="sellingPrice" label="Selling Price" name="sellingPrice" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="gstAmount" label="Gst Amount" name="gstAmount" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="gstPercentage" label="Gst Percentage" name="gstPercentage" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="shippingCharge" label="Shipping Charge" name="shippingCharge" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="netAmount" label="Net Amount" name="netAmount" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="specialOffer" label="Special Offer" name="specialOffer" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="paymentMode" label="Payment Mode" name="paymentMode" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="transactionStatus" label="Transaction Status" name="transactionStatus" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="deliveredBy" label="Delivery By" name="deliveredBy"
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="deliveredTo" label="Delivery To" name="deliveredTo"
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="deliveredTime" label="Delivery Time" name="deliveredTime"
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <CustomSelect field="deliveryStatus" label="Delivery Status" name="deliveryStatus" getOptionValue={option => option.id} getOptionLabel={option => option.name} options={this.state.status} onChange={this.handleChange}
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="deliveredDate" label="Delivery Date" name="deliveredDate" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="stdDeliveryTime" label="StdDeliveryTime" name="stdDeliveryTime" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="preferedDeliveryTime" label="PreferedDelivery Time" name="preferedDeliveryTime" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="cancellation" label="Cancellation" name="cancellation" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="cancellationReason" label="Cancellation Reason" name="cancellationReason" readOnly
                                    />
                                </Col>
                                <Col md={3} sm={12} >
                                    <Input
                                        field="failureReason" label="Failure Reason" name="failureReason" readOnly
                                    />
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                            </div>
                        </div>
                    )}
                </Form>
            </Fragment>
        )
    }
}