import React, { PureComponent } from 'react';
import _ from 'lodash';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { getCategorybyId } from '../../../service/dashboardService';
import BreadCrumb from 'components/common/forms/BreadCrumb';
import * as InoIcons from 'react-icons/io';

import 'styles/forms.css';

class ProductDetails extends PureComponent {

    state = {
        data: [],
    }

    async componentDidMount() {
        const { match: { params: { pageName } } } = this.props.props;
        if (pageName === "productdetails") {
            await this.getProductDetails();
        } else {
            await this.productDeliveryStauts();
        }
    }

    productDeliveryStauts = async () => {
        const { location: { state } } = this.props.props;
        await this.setState({ data: state.data })
        await this.initTableData()
    }

    getProductDetails = async () => {
        const { location: { state } } = this.props.props;
        let id = state.id, response, params;
        params = `categoryId=${id}`
        response = await getCategorybyId(params)
        const { data: { statusCode, data } } = response;
        if (statusCode === 0)
            return this.setState({ data: [], isTableLoading: false });
        await this.setState({ data, isTableLoading: false })
        await this.initTableData()
    }

    initTableData = async () => {
        const { hideColumns } = this.state;
        const columnHeaders = this.getColumnHeaders(this.props.prefixUrl);
        const columns = getColumns(columnHeaders, hideColumns);
        await this.setState({ columns, columnHeaders, hideColumns })
    }

    getColumnHeaders(prefixUrl = "") {
        const { match: { params: { pageName } } } = this.props.props;
        let allKeys = ["Product Id", "Product Name", "Product Status", "Actions"];
        let excludeKeys = [];
        switch (pageName) {
            case "productdetails":
                excludeKeys = ["Actions"]
                break;
            case "productStatus":
                excludeKeys = ["Product Status"]
                break;
            default:
                break;
        }
        let keys = _.filter(allKeys, (v) => !_.includes(excludeKeys, v))
        let def = {
            "Product Id": { dataField: 'productId', text: 'Product Id ', sort: true, },
            "Product Name": { dataField: 'productName', text: 'Product Name ', sort: true, },
            "Product Status": { dataField: 'productStatus', text: 'Product Status ', sort: true, },
            "Actions": { dataField: 'actions', isDummyField: true, text: "Actions", formatter: this.actionsFormatter }
        }
        return { "keys": keys, "def": def }
    }


    actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
        let links = [];
        links.push(<InoIcons.IoIosEye title="View" onClick={() => this.viewFun(`/dashboard/ViewProductStatus`, row)} />)
        return <div className="actions">{links.concat(" ")}</div>
    }

    viewFun = async (url, row) => {
        let path = url;
        this.props.props.history.push({
            pathname: path,
            state: { row },
        })
    }

    render() {
        const { match: { params: { pageName } } } = this.props.props;
        const { data, columns } = this.state;
        const breadCrumbItems = {
            title: "Product Details",
            items: [
                { name: "Home", active: false, link: "/dashboard" },
                { name: "Dashboard", active: false, link: "/dashboard" },
                { name: "ProductDetails", active: true },
            ]
        };
        return (
            <React.Fragment >
                <BreadCrumb data={breadCrumbItems} />
                <div className="clearfix"> </div>
                {data && columns && pageName === "productdetails" &&
                    <div>
                        <BootstrapTable
                            keyField="productId"
                            data={data}
                            columns={columns}
                            bootstrap4
                            pagination={paginationFactory()} striped hover condensed
                            classes="table table-bordered table-hover table-sm"
                            wrapperClasses="table-responsive"
                            noDataIndication={'No data to display here'}
                        />
                    </div>

                }{
                    data && columns && pageName === "productStatus" &&
                    <div>
                        <BootstrapTable
                            keyField="productId"
                            data={data}
                            columns={columns}
                            bootstrap4
                            pagination={paginationFactory()} striped hover condensed
                            classes="table table-bordered table-hover table-sm"
                            wrapperClasses="table-responsive"
                            noDataIndication={'No data to display here'}
                        />
                    </div>
                }
            </React.Fragment >
        )
    }
}
function getColumns(columnsHeaders, hideColumns) {
    let columns = []
    const { keys, def } = columnsHeaders;

    _.forEach(keys, (key) => {
        columns.push({ ...def[key], hidden: _.includes(hideColumns, key) })
    })
    return columns;
}

export default ProductDetails;