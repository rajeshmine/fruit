import React, { PureComponent, Fragment } from 'react';
import { Input } from "components/common/forms/Input";
import ReactNotification from "react-notifications-component";

import Joi from 'joi-browser';
import { Row, Col } from 'reactstrap'
import { FormGroup, Button } from 'reactstrap';
import { Form } from 'informed';
import { editPassword } from 'service/profileService';
import BreadCrumb from 'components/common/forms/BreadCrumb';
import { getJwt } from 'service/authService';


class ChangePassword extends PureComponent {

  state = {
    data: {},
    passmatch:false
  }

  constructor(props) {
    super(props);
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  addNotification(data) {
    console.log(data)
    this.notificationDOMRef.current.addNotification({
      title: "Success Message",
      message: data,
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }

  componentDidMount = async () => {
    await this.getUserInfo();
  }

  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name)
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  };

  schema = {
    oldpassword: Joi.string().required().label("Old Password"),
    newpassword: Joi.string().required().label("New Password"),
    confirmpassword: Joi.string().required().label("Confirm Password"),
  };

  handleChange = async ({ currentTarget: Input }) => {
    const { name, value } = Input;
    const { data } = this.state;
    data[name] = value;

    await this.setState({
      [name]: value
    })

  }

  getUserInfo = async () => {
    let res = await getJwt('__info');
    console.log(res)
    const { uid } = res;
    await this.setState({ uid: uid, userInfo: res, mail: res.email });
    console.log(this.state.mail)
  }


  onSubmit = async () => {

    const data = this.formApi.getState().values;
    const { oldpassword, newpassword } = data
    const { mail, passmatch } = this.state

    if (data.newpassword !== data.confirmpassword) {
      this.setState({passmatch : false})
      this.addNotification('Password Mismatch');
      this.formApi.setValue('newpassword', '')
      this.formApi.setValue('confirmpassword', '')

    }else{
      this.setState({passmatch : true})
    }

    if(passmatch){
      let payload =    {
        "email": mail,
        "oldPassword": oldpassword,
        "newPassword": newpassword
      }
      console.log(payload)
      let res = await editPassword(payload)
      console.log(res)
      if (res.data.statusCode !== 1){
         this.addNotification(res.data.message);
        this.formApi.reset();
      } 
      if (res.data.statusCode === 1) {
        this.addNotification(res.data.message);
        this.formApi.reset();
      }
    }
    
  }

  setFormApi = (formApi) => {
    this.formApi = formApi;
    console.log(this.formApi)
  }

  render() {

    const breadCrumbItems = {
      title: 'Wishlist',
      items: [
        { name: 'Profile', active: false, link: '/' },
        { name: 'Wishlist', active: true },
      ]
    };



    return (
      <Fragment>
        <BreadCrumb data={breadCrumbItems} />
        <ReactNotification ref={this.notificationDOMRef} />
        <h2 className="text-center">Change Password</h2>
        <Row>
          <Col sm={3} ></Col>
          <Col sm={6} >
            <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
              {({ formApi, formState }) => (
                <div>
                  <Input field="oldpassword" label="Old Password" name="oldpassword" maxLength="10" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('oldpassword', e)} />

                  <Input field="newpassword" label="New Password" name="newpassword" maxLength="10" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('newpassword', e)} />
                  <Input field="confirmpassword" label="Confirm Password" name="confirmpassword" maxLength="10" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('confirmpassword', e)} />
                  <FormGroup className="text-right">
                    <Button type="submit" value="Submit" color="success" size={"sm"}  >Submit</Button>
                  </FormGroup>

                </div>
              )}
            </Form>
          </Col>
          <Col sm={3} ></Col>
        </Row>
      </Fragment>
    )
  }
}

export default ChangePassword;