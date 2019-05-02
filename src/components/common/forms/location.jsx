import React, { PureComponent, Fragment } from 'react'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Input, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import logo from 'images/favicon.png';
import 'styles/nav.css';
import { Form } from 'informed';
import SearchField from "react-search-field";
import efv from './../../../images/efv.png';
import * as MdnIcons from 'react-icons/md';
import Modal from 'react-responsive-modal';
import * as IonIcons from 'react-icons/io';
import chooselocationimage from '../../../images/formlocation.svg';
import StarRatingComponent from 'react-star-rating-component';
import { getLocation } from '../../../service/location';
import { CustomSelect } from "components/common/forms/custom-select";
import ToggleDisplay from 'react-toggle-display';
class Location extends PureComponent {
  constructor() {
    super();

    this.state = {
      rating: 0,
      show: false
    };
  }
  handleClick() {
    this.setState({
      show: !this.state.show
    });
  }
  async componentDidMount() {
    let res = await getLocation()
    console.log(res)
    if (res.data.statusCode === 1) {
      await this.setState({
        locations: res.data.data
      })
    }
  }


  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }
  state = {
    open: false

  };
  onOpenModal = () => {
    this.setState({ open: true });
  };
  onCloseModal = () => {
    this.setState({ open: false });
  };


  onSubmit = async () => {

    let res = ''
    const data = this.formApi.getState().values;

    console.log(data.configName)
    let getData = {
      "configName": data.configName

    }
    // res = await addFeedback(postData)

    res = await getLocation(getData)


    return false;
    // console.log(res)


  }
  setFormApi = (formApi) => {
    this.formApi = formApi;
    console.log(this.formApi)
  }
  resetForm = async () => {
    this.formApi.reset();
    // this.myForm.reset();
  }
  render() {
    const { open } = this.state;

    const { rating } = this.state;
    return (
      <Fragment>

        {/* choose location */}
        <div id="mybutton1" >
          <a href="#" onClick={this.onOpenModal}>
            <MdnIcons.MdLocationOn class="chooselocation" />
          </a>
        </div>




        {/*modal for choose location */}
        <div>

          <Modal open={open} onClose={this.onCloseModal} center>
            <img

              src={chooselocationimage} width={20} height={21}
            /> Choose Location
            <Form name="myForm" getApi={this.setFormApi} onSubmit={this.onSubmit}>
              {({ formApi, formState }) => (
                <div><br />
                  <div class="col-lg-12 col-md-12 col-xs-12">
                    <div class="form-group">
                      <CustomSelect field="configName" name="configName" required
                        getOptionValue={option => option.configValue}
                        getOptionLabel={option => option.configValue}
                        options={this.state.locations} onChange={this.handleChange}
                      />
                      <div class="help-block with-errors"></div>
                    </div>
                  </div>
                  <br />
                  <div id="submitbtnpadding">
                    <button type="submit" id="submitbtn" class="btn btn-common btn-form-submit" onClick={() => this.handleClick()}>Submit</button>

                  </div>
                  <div id="togglediv">
                    <ToggleDisplay show={this.state.show}>
                      We will Deliver to this address.
                    </ToggleDisplay>
                  </div>
                </div>)}
            </Form>
          </Modal>
        </div>
      </Fragment >
    )
  }
}

export default Location;

