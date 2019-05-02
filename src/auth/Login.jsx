import React, { PureComponent, Fragment } from 'react';
import { FormGroup, Button } from 'reactstrap';
import * as IonIcon from 'react-icons/io'
import { Form } from 'informed';
import { Input } from 'components/common/forms/Input';
import { Link } from 'react-router-dom';
import Joi from 'joi-browser';
import { loadProgressBar } from 'axios-progress-bar'
import _ from 'lodash';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import { gooogleClientId, facebookAppId } from "config.json";
import { login, storeData, signUp, checkUser } from 'service/authService';
import 'styles/login.css';

class Login extends PureComponent {
  _isMounted = false;
  state = {
    data: {}
  }

  componentWillMount = () => {
    this._isMounted = false;
  }

  componentDidMount = () => {
    loadProgressBar();
    this._isMounted = true;
    if (this._isMounted)
      this.sampleData();
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  }

  sampleData = async () => {
    let data = this.dataGenerator();
    await this.setState({ data })
    await this.formApi.setValues(data);
  }



  dataGenerator = () => {
    const data = {
      loginId: 'monu@gmail.com',
      password: '123'
    };
    return data;
  }



  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name)
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  }

  schema = {
    loginId: Joi.string().required().label("User Name"),
    password: Joi.string().required().label("Password"),
  }

  setFormApi = (formApi) => {
    this.formApi = formApi;
  }

  handleChange = async ({ currentTarget: Input }) => {
    const { id: name, value } = Input;
    const { data } = this.state;
    data[name] = value;
    await this.setState({ data })
  }

  onSubmit = async () => {
    const formData = this.formApi.getState().values;
    try {
      const res = await login(formData);
      const { data } = res;
      this.storeData('__info', data);
    } catch (err) {
      this.handleError(err)
    }

  }



  responseGoogle = async (response) => {
    try {
      const { profileObj } = response;
      const { email } = profileObj;
      const status = await this.checkUser(email);
      if (status) {
        this.storeData('__info', profileObj);
        // this.storeData('token', profileObj);
      } else {
        this.signUp(profileObj);
      }
    } catch (err) {
      this.handleError(err)
    }
  }

  responseFacebook = async (response) => {
    try {
      const profileObj = response;
      const { email } = response;
      const status = await this.checkUser(email);
      if (status) {
        this.storeData('__info', profileObj);
        // this.storeData('token', profileObj);
      } else {
        this.signUp(profileObj);
      }
    } catch (err) {
      this.handleError(err)
    }
  }

  signUp = async (data = {}) => {
    try {
      let payload = data;
      payload.password = "";
      payload.contactno = '';
      payload.userRole = 'U';
      console.log(payload)
      const res = await signUp(payload);

      console.log(res)
    } catch (err) {
      this.handleError(err)
    }

  }


  checkUser = async (email) => {
    try {
      const res = await checkUser(email);
      console.log(res)
      return true;
    } catch (err) {
      this.handleError(err)
    }
    return false;
  }



  storeData = async (key, userInfo) => {
    await this.setState({ userInfo })
    const { access_token } = userInfo;
    await storeData('token', access_token);
    await storeData(key, userInfo);
    this.redirect();
  }

  redirect = () => {
    const { props } = this.props;
    const { userInfo: { userRole } } = this.state;
    let endPoint = '/user/homedetails';
    switch (userRole) {
      case 'U':
        endPoint = '/user/homedetails';
        break;
      case 'D':
      case 'A':
        endPoint = '/dashboard';
        break;
      default:
        endPoint = '/user/homedetails';
        break;
    }
    props.history.push(endPoint);
    window.location.reload();
  }

  handleError = (err) => {
    console.log(err);
  }

  render() {
    return (
      <Fragment >
        <h2 className="text-center">Login Now</h2>
        <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
          {({ formApi, formState }) => (
            <div>
              <Input field="loginId" label="User Name" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('loginId', e)} />

              <Input field="password" type="password" label="Password" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('password', e)} />
              <FormGroup >
                <Link to="/auth/usernamerecovery"> Forgot password?</Link>
                <Button type="submit" className="float-right" value="Submit" color="success" size={"sm"} disabled={formState.invalid} >
                  Submit</Button>
              </FormGroup>
              <div className="social-media text-center">
                <GoogleLogin
                  clientId={gooogleClientId}
                  render={renderProps => (
                    <IonIcon.IoLogoGoogle className="google" onClick={renderProps.onClick} disabled={renderProps.disabled} />
                  )}

                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                  cookiePolicy={'single_host_origin'}
                />
                <FacebookLogin
                  appId={facebookAppId}
                  autoLoad={false}
                  callback={this.responseFacebook}
                  icon={<IonIcon.IoLogoFacebook className="facebook" />}
                  fields="name,email,picture"
                  tag="a"
                  textButton=""
                  size="small"
                  cssClass="facebook-btn-style"
                />
              </div>
              <div>
                <p>If you don't have account please <Link to="/auth/webcreateaccount"> Sign
                                up</Link> here.</p>
              </div>
            </div>
          )}
        </Form>
      </Fragment>
    );
  }
}

export default Login;

