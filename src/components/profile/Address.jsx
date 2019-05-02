
import React, { PureComponent, Fragment } from 'react'
import _ from 'lodash';
import { Row, Col, Button } from 'reactstrap';
import Joi from 'joi-browser';

import { Textarea } from "components/common/forms/textarea";
import { Form } from 'informed';
import { CustomRadio } from 'components/common/forms/custom-radio';
import { Input } from "components/common/forms/Input";

import { getJwt } from 'service/authService';
import { getProfileDetails, updateProfileDetails } from 'service/profileService'
import { sendOtp } from 'service/authService'
import { getPincodedetails } from 'service/cartService';

import moment from 'moment';
import { DatetimePickerTrigger } from 'rc-datetime-picker';

import 'rc-datetime-picker/dist/picker.min.css'

class Address extends PureComponent {



  state = {
    newAddress: false,
    otpfeild: false,
    data: {},
    paymode: ["online", "cod"],
    addressList: [],
    pincodes: [],
    deliverytime: ["Standard Delivery Time", "Preferred Delivery Time"],
    date: new Date(),
    moment: moment(),
    stdDeliveryTime: moment().add(1, 'hours').format('YYYY-MM-DD HH:mm'),
    preDeliveryTime: moment().add(1, 'hours').format('YYYY-MM-DD HH:mm')
  }


  schema = {
    paymode: Joi.string().required().label('Payment Mode'),
    address: Joi.string().required().label('Address'),
    city: Joi.string().required().label('City'),
    state: Joi.string().required().label('State'),
    pincode: Joi.number().required().label('Pincode'),
    mobileNo: Joi.string().required().label('Mobile No'),
    preDeliveryTime: Joi.string().required().label('Pre Delivery Time'),
    deliverytime: Joi.string().required(),
  }

  componentDidMount = async () => {

    await this.profileDetails();
    await this.getUserInfo();
    await this.pincodeDetails();
  }

  componentWillReceiveProps = async () => {

  }

  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name)
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  };


  async editAddress() {
    await this.toggleAddress();
    await this.formApi.setValues(this.state.profileData[0])
  }

  async pincodeDetails() {
    let res = await getPincodedetails()
    console.log(res)
    if (res.data.statusCode === 1) {
      await this.setState({ pincodes: res.data.data })
    }
  }

  getUserInfo = async () => {
    let res = await getJwt('__info');
    const { uid } = res;
    await this.setState({ uid: uid, userInfo: res });
  }


  setFormApi = (formApi) => {
    this.formApi = formApi;
    console.log(this.formApi)
  }


  addressLoad = () => {
    const { addressList } = this.state;

    return _.map(addressList, (f, i) =>
      <div className="card2" key={i}>
        <Row className="row cartrowpaddingnew">
          <Col md={8} >
            <p id="cartpageparagraph1">{f}</p>
          </Col>
          <Col md={4} className="text-right">
          </Col>
        </Row>
        <Row className="row cartrowpaddingnew">
          <Col md={8}>
            <Button type="submit" className="btn-common shipbtn" onClick={() => this.cartDataStore(i)}>SHIP TO THIS ADDRESS</Button>
          </Col>
          {i !== 0 && <Col md={4} className=" text-right">
            <Button type="button" onClick={() => this.editAddress()}>
              Edit
            </Button>
          </Col>}
        </Row>
      </div>
    );
  }

  toggleAddress = async () => {
    await this.setState(state => ({ newAddress: !state.newAddress }))
  }

  profileDetails = async () => {
    const { uid } = this.props
    let params = `userId=${uid}`
    let res = await getProfileDetails(params)
    console.log(res)
    if (res.data.statusCode) {
      await this.setState({ profileData: res.data.data })
      await this.addressListPrepare();
    }
    else
      await this.setState({ profileData: [] })

  }


  addressListPrepare = async () => {
    const { address1, address2, city1, city2, pincode1, pincode2, phone, secondaryContactNo } = this.state.profileData[0];
    let temp = [];

    const primaryAddress = `${address1},${city1},${pincode1}`;
    const secondaryAddress = `${address2},${city2},${pincode2}`;
    await temp.push(primaryAddress);
    await temp.push(secondaryAddress);
    let addressList = await _.compact(temp);
    await this.setState({ addressList });
  }


  handleChange = async ({ currentTarget: Input }) => {
    const { name, value } = Input;
    const { data } = this.state;
    data[name] = value;
    await this.setState({ [name]: value })

  }


  onSubmit = async () => {
    await this.updateAddress()
  }



  updateAddress = async () => {
    if (!this.checkPincode())
      return alert("Our Service is not available for this zone. Soon we will give a best Service");

    const data = this.formApi.getState().values;
    const { address2, pincode2, city2, state2, secondaryContactNo } = data
    const { email, uid, userName } = this.state.userInfo
    const { address1, city1, pincode1, phone } = this.state.profileData[0];
    let postData = {
      "address1": address1,
      "city1": city1,
      "pincode1": pincode1,
      "address2": address2,
      "city2": city2,
      "pincode2": pincode2,
      "addType2": "o",
      "email": email,
      "defaultAddress": "1",
      "name": userName,
      "state1": "Tamil Nadu",
      "state2": state2,
      "secondaryContactNo": secondaryContactNo,
      "primaryContactNo": phone,
      "addType1": "o",
      "userId": uid
    }
    let res = await updateProfileDetails(postData)
    console.log(res)
    if (res.data.statusCode === 1) {
      alert(res.data.message)
      await this.profileDetails()
      await this.toggleAddress()
    }
  }

  checkOtp() {
    const data = this.formApi.getState().values;
    if (this.state.sentOtp !== data.otp)
      return alert("please Enter a valid OTP")


  }

  checkPincode = () => {
    const data = this.formApi.getState().values;
    const { pincodes } = this.state
    if (pincodes) {
      let temp = _.filter(pincodes, v => v["configValue"] === data.pincode2);
      if (temp.length !== 0)
        return true;
      return false;
    }
  }

  async getValue(data) {
    await this.setState({ paymentmode: data.target.value })
  }

  async getDeliveryValue(data) {
    console.log(data.target.value)
    await this.setState({ delivery: data.target.value })
  }

  async sendOtp() {
    const data = this.formApi.getState().values;
    const { mobile } = data
    if (mobile) {
      let params = `mobileNo=${mobile}`
      let res = await sendOtp(params)
      if (res.data.statusCode === 1)
        await this.setState({ sentOtp: res.data.message, otpfeild: true })
    }
  }

  cartDataStore = async (index) => {
    const { cartDataStore, handleNext } = this.props;
    const { stdDeliveryTime, preDeliveryTime, uid } = this.state;
    const { address1, address2, city1, city2, userName, pincode1, pincode2, phone, secondaryContactNo } = this.state.profileData[0];
    console.log(this.state.profileData[0])
    let address = {
      stdDeliveryTime,
      preDeliveryTime,
      "userId": uid,
      "delName": userName,
      "delPhone": phone,
      "delAddress": address1,
      "delCity": city1,
      "delPincode": pincode1,

    };
    if (!index) {
      const address1 = {
        "delPhone": secondaryContactNo,
        "delAddress": address2,
        "delCity": city2,
        "delPincode": pincode2,
      };
      _.assign(address, address1)
    }
    await cartDataStore(address)
    await handleNext();
  }


  dateChange = async (moment) => {
    this.setState({ preDeliveryTime: moment.format('YYYY-MM-DD HH:mm') });
    await this.formApi.setValue("preDeliveryTime", moment.format('YYYY-MM-DD HH:mm'))
  }


  render() {
    const { newAddress, paymode, otpfeild, paymentmode, delivery } = this.state
    const shortcuts = {
      'Today': moment(),
      'Yesterday': moment().subtract(1, 'days'),
      'Clear': '',
      splitPanel: true
    };

    return (
      <Fragment>

        <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
          {({ formApi, formState }) => (
            <div className="well cartwell">

              <Row className="adddetails" >
                <Col md={12} className="contactformrowpadding">
                  <Row>
                    <Col md={3} sm={12} >
                      <CustomRadio field="deliverytime" label="Delivery Time" name="deliverytime" options={this.state.deliverytime} checked={this.state.checked} validateOnBlur validate={e => this.validateProperty('deliverytime', e)} onChange={(e) => this.getDeliveryValue(e)} />
                    </Col>
                  </Row>
                  <Row>

                    {delivery === 'Preferred Delivery Time' &&
                      <Col md={6} sm={12} >
                        <DatetimePickerTrigger
                          shortcuts={shortcuts}
                          moment={this.state.moment}
                          onChange={this.dateChange}>
                          <Input field="preDeliveryTime" name="preDeliveryTime" label="Pre Delevery Time" validateOnBlur validate={e => this.validateProperty('preDeliveryTime', e)} />
                        </DatetimePickerTrigger>
                      </Col>
                    }

                  </Row>
                  <Row>
                    <Col md={12} id="savedaddress" name="btn">
                      {this.addressLoad()}
                    </Col>
                    <br />
                    {!newAddress && <Col md={12} name="btn">
                      <p>Click <span style={{ color: "#004cff" }} onClick={() => this.toggleAddress()}>here </span> add new address.</p>
                    </Col>}
                  </Row>
                  {
                    newAddress &&
                    <Row>
                      <Col md={12} name="btn">
                        <Textarea field="address2" label="Address" name="address1" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('address', e)} />
                      </Col>
                      <Col md={3} name="btn">
                        <Input field="city2" name="city" label="City" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('city', e)} />
                      </Col>
                      <Col md={3} name="btn">
                        <Input field="state2" name="state" label="State" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('state', e)} />
                      </Col>
                      <Col md={3} name="btn">
                        <Input field="pincode2" name="pincode" label="Pincode" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('pincode', e)} />
                      </Col>
                      <Col md={3} name="btn">
                        <Input field="secondaryContactNo" name="Mobile No" label="Mobile No" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('mobileNo', e)} />
                      </Col>
                      <Col style={{ textAlign: 'right' }}>
                        <Button color={"warning"} className="mr-3" size={"sm"} onClick={this.toggleAddress} >Cancel</Button>
                        <Button disabled={formState.invalid} size={"sm"}>Update</Button>
                      </Col>
                    </Row>
                  }

                </Col>
              </Row>
              <Row>
                <Col md={3} sm={12} >
                  <CustomRadio field="paymode" label="Payment Mode" name="paymode" options={this.state.paymode} validateOnBlur validate={e => this.validateProperty('paymode', e)} onChange={(e) => this.getValue(e)} />
                </Col>
              </Row>

              {paymentmode === 'cod' &&
                <Row>
                  <Col sm={4}>
                    <Input field="mobile" name="mobile" label="Mobile" onChange={this.handleChange} />

                  </Col>
                  {/* <Col sm={2}>
                    <button type="button" onClick={() => this.sendOtp()} className="btn btn-primary btn-sm" style={{ marginTop: '28px' }}>Send OTP</button>

                  </Col> */}
                  {
                    otpfeild &&
                    <div>
                      <Input field="otp" name="otp" label="OTP" onChange={this.handleChange} />
                      <button type="button" onClick={() => this.checkOtp()} className="btn btn-primary btn-sm">Submit</button>
                    </div>
                  }
                </Row>
              }
            </div>
          )}
        </Form>
      </Fragment>
    )
  }
}

export default Address;

