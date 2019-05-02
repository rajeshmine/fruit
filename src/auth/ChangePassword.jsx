import React, { PureComponent, Fragment } from 'react';
import { Input } from "components/common/forms/Input";
import Joi from 'joi-browser';

import { FormGroup,  Button } from 'reactstrap';
import { Form } from 'informed';
 

class ChangePassword extends PureComponent {


  state = {
    data: {},
    otpFeild: false,
    passwordFeild: false
  }

  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name)
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  };

  schema = {
    mobile: Joi.string().min(10).max(10).regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/).required().label("Mobile Number"),
    otp: Joi.string().required().label("OTP"),
    passWord: Joi.string().required().label("Password"),
    CpassWord: Joi.string().required().label("Confirm Password"),
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

    const data = this.formApi.getState().values;
    console.log(data.otp)
    if (data.otp === undefined) {
      await this.setState({ otpFeild: true })
    } else {
      await this.setState({ otp: data.otp })

    }
    if (data.otp > 3) {
      await this.setState({ otpFeild: false, passwordFeild: true })
    }
    if (data.passWord !== data.CpassWord) {
      alert('Password Mismatch')

      await this.setState({ otpFeild: false })
      this.formApi.setValue( 'passWord', '')
      this.formApi.setValue( 'CpassWord', '')
     
    }
    if(this.state.passwordFeild){
      await this.setState({ otpFeild: false })

    }

    console.log(data)
  }

  setFormApi = (formApi) => {
    this.formApi = formApi;
    console.log(this.formApi)
  }

  render() {
    const { otp, otpFeild, passwordFeild } = this.state
     
    let readOnly = "";
    if (otp) {
      readOnly = "readOnly"
    }

    return (
      <Fragment>
        <h2 className="text-center">Account recovery</h2>
        <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
          {({ formApi, formState }) => (
            <div>
              <Input field="mobile" label="Mobile No" name="mobile" maxLength="10" onChange={this.handleChange} readOnly={readOnly} validateOnBlur validate={e => this.validateProperty('mobile', e)} />


 
              {otpFeild &&

                <Input field="otp" label="OTP" name="otp" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('otp', e)} />


              }
              {
                passwordFeild &&
                <div>
                  <Input field="passWord" type="password" id="pwd" label="Password" name="passWord" validateOnBlur validate={e => this.validateProperty('passWord', e)} onChange={this.handleChange} />
                  <Input field="CpassWord" type="password" label="Confirm Password" name="CpassWord" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('CpassWord', e)} />


                </div>
              }

              <FormGroup className="text-right">
                <Button type="submit" value="Submit" color="success" size={"sm"}  >Submit</Button>
              </FormGroup>

            </div>
          )}
        </Form>
      </Fragment>
    )
  }
}

export default ChangePassword;


