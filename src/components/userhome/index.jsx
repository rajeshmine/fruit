import React, { PureComponent, Fragment } from 'react'
// import OwlCarousel from 'react-owl-carousel';

import _ from 'lodash';

import { Container, Row, Col} from 'reactstrap'; 

import 'styles/style.css';

import 'styles/userstyle.css';
import Carousel from 'react-bootstrap/Carousel'
import Headers from 'components/common/forms/Headers';
import Footers from 'components/common/forms/Footers';
// import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
 

import { getseasonbasket } from 'service/seasonbasket';
import { getspecialOffer } from 'service/specialoffers';
import Card from '../common/forms/Card';
import { getcarousel } from '../../service/carousel';


class Home extends PureComponent {
 

 

  componentDidMount() {
    // console.log(this.props)
    const { pageName } = this.props.match.params
    // console.log(pageName)
    this.getspecialOffer();
    this.getseasonbasket();
    this.getcarousel();
  }

  state = {
    data: [],
    specialOfferList: [],
    seacenBasketList: [],
    carouselList: []
  }

  //for special offers
  getspecialOffer = async () => {
    let res = await getspecialOffer();
    console.log(res);
    if (res.data.statusCode) {
      await this.setState({ specialOfferList: res.data.data })
    }
  }

  frameLoad = () => {
    const { specialOfferList } = this.state; 
    return _.map(specialOfferList, w => <Col md={3} sm={12}>
      <Card prodname={w.productName} fixprice={w.sellingPrice} offerprice={w.mrp} prodcount={w.productUomId + w.productUom} imgsource={w.imageUrl} />
      <div class="">
        <div class="ribbon"><span> {Math.round(((w["mrp"] - w["sellingPrice"]) * 100) / w["mrp"])} % OFF</span></div>
      </div>
    </Col>
    )
  }
  //for season basket
  async getseasonbasket() {
    let res = await getseasonbasket();
    if (res.data.statusCode === 1) {
      await this.setState({ seacenBasketList: res.data.data })
    }
  }

  frameLoad1 = () => {
    const { seacenBasketList } = this.state;

    return _.map(seacenBasketList, v =>
      <div class="item itemwidth">
        <Card prodname={v.productName} fixprice={v.sellingPrice} offerprice={v.mrp} prodcount={v.productUomId + v.productUom} imgsource={v.image} />
        <div class="">
          <div class="ribbon1"><span>{Math.round(((v["mrp"] - v["sellingPrice"]) * 100) / v["mrp"])} % OFF</span></div>
        </div>
      </div>)

  }
  //for carousel
  async getcarousel() {
    let res = await getcarousel();
    if (res.data.statusCode === 1) {
      await this.setState({ carouselList: res.data.data })
    }
  }

  frameLoad2 = () => {
    const { carouselList } = this.state;

    return _.map(carouselList, s =>
      <div class="item"><img src={s.imageURL} alt=
        {s.imageDescription} width={500} height={400} className="d-block w-100" /></div>
    )
  }
  render() {
  




    return (
      <Fragment>
        <Headers props={this.props} onClick={(id) => this.catagoryId(id)} /> 
        <Carousel>
          {this.frameLoad2()}
        </Carousel>
        

               {/* CardDiv */}
          <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="mycard" style={{  marginTop: '-100px'}}>
                <div className="row">
                  <div className="col-md-4 col-sm-4 col-xs-6">
                    <div className="borderright">
                      <img src="/images/userimages/icons/freshfruit.png" alt="images" />
                    
                      <h3>Freshness Guaranteed</h3>

                      <p>We will deliver always fresh fruits and <br />vegetables to the customer to maintain<br /> our brand reputation.</p>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-6">
                    <div className="borderright">
                      <img src="/images/userimages/icons/free-delivery.png" alt="images" />
                      <h3>Free Delivery Policy</h3>
                      <p>We do free delivery if the order is less than Rs. 250. <br />Above Rs 250 purchase delivery charges<br /> will applicable as per the policy.</p>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-6">
                    <div className="">
                      <img src="/images/userimages/icons/truck.png" alt="images" />
                      <h3>1 Hour Delivery</h3>
                      <p>We do 1 hour delivery for all products. <br />We generally operate on slots which helps to <br />both customer as well as us.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>


        <Container id="containerpadding">
       
          <Row>
       
            <Col md={12} sm={12}>
              <h3 class="playList1">OUR SPECIAL OFFERS</h3>
              <hr id="hrline" />
            </Col>
          </Row>   <br />
          <Row>   <br />
            {this.frameLoad()}
          </Row>
          <Row>
            <Col md={8} sm={12}>
            </Col>
          </Row>
        </Container>
        <Container id="containerpadding">
          <Row id="rowpadding">
            <Col md={12} sm={12}>
              <h3 class="playList1">OUR BEST SELLING BASKETS</h3>
              <hr id="hrline" />
            </Col>
          </Row>
          {/* <OwlCarousel
            className="owl-theme"
            loop
            margin={10}
            nav={false}
          // navigation={true}
          >

            {this.frameLoad1()}


          </OwlCarousel> */}
        </Container>
        <br/>
        <Container id="containerpadding">
          <Row>
            <Col md={12} sm={12}>
              <h3 class="playList1">FRUITS AND VEGETABLES</h3>
              <hr id="hrline" />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <a href="#">
                <div class="fruitsbg">
                  <div class="textcard">
                  </div>
                </div>
              </a>
            </Col>
            <Col md={3}>
              <a href="#">
                <div class="vegbg">
                  <div class="textcard">
                  </div>
                </div>
              </a>
            </Col>
            <Col md={3}>
              <a href="#">
                <div class="cocobg">
                  <div class="textcard">
                  </div>
                </div>
              </a>
            </Col>
            <Col md={3}>
              <a href="#">
                <div class="cornerbg">
                  <div class="textcard">
                  </div>
                </div>
              </a>
            </Col>

          </Row>
        </Container><br /><br /><br /><hr />
        <Footers props={this.props} />

         
      </Fragment>
    )
  }
}

export default Home;





