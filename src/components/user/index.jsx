import React, { PureComponent, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';

import UserDashboard from 'components/user/userdashboard';
import Headers from 'components/common/forms/Headers';
import Footers from 'components/common/forms/Footers';
import { getProductsbyId } from 'service/dashboardService'
import { searchProduct } from 'service/catalogService'

class User extends PureComponent {

  componentDidMount() {
    console.log(this.props)
    const { pageName } = this.props.match.params;
  }

  state = {
    data: [],
    categoryId: ''
  }

  async catagoryId(id) {
    await this.setState({ categoryId: id });
    const { categoryId } = this.state;

    this.getProducts(id)
  }

  async getProducts(categoryid) {
    let params = `categoryId=${categoryid}`
    let res = await getProductsbyId(params)
    if (res.data.statusCode === 1) {
      await this.setState({ data: res.data.data });
    } else {
      await this.setState({ data: [] })
    }
  }

  frameLoad = () => {
    const { data, categoryId } = this.state;
    const { match: { params: { pageName } } } = this.props;
    if (pageName && data) {
      return <UserDashboard props={this.props} data={data} />
    }
  }

  searchProdItems = async (term) => {
    if (term !== '' && term !== null && term !== null) {
      const res = await searchProduct(term);
      const { data: { data } } = res;
      await this.setState({ data }) 
    }
  }


  render() {
    return (
      <Fragment>
        <Headers props={this.props} onClick={(id) => this.catagoryId(id)} onChange={(term) => this.searchProdItems(term)} />
        <Container>
          <Row>
            <Col md={12}  >
              {this.frameLoad()}
            </Col>
          </Row>
        </Container>
        <Footers props={this.props} />
      </Fragment>
    )
  }
}

export default User;