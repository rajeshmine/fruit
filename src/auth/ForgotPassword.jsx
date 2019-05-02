import React, { PureComponent, Fragment } from 'react';
import Joi from 'joi-browser';

import { Input } from "components/common/forms/Input";
import { FormGroup, Button } from 'reactstrap';
import { Form } from 'informed';
import { sendOtp, forgotPassword } from 'service/authService'



class ForgotPassword extends PureComponent {


  state = {
    data: {},
    otpFeild: false,
    passwordFeild: false,
    readOnly : "readOnly"
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
    console.log(data , data.otp)
     if(!data.otp){
      await this.setState({
          otpFeild : true
        })
        let params = `mobileNo=${data.mobile}`
        console.log(params)
        let res = await sendOtp(params)
        console.log(res)
        if (res.data.statusCode === 1) {
          await this.setState({ userOtp: res.data.message })
        }
     }
    
      if(data.otp){
          if(data.otp !== this.state.userOtp ){
              alert("OTP mismatch")
          }else if(data.otp === this.state.userOtp){
            console.log("dfdgdf")            
              this.setState({passwordFeild : true})
          }
      }

      if (data.passWord !== data.CpassWord) {
            alert('Password Mismatch') 
            this.formApi.setValue('passWord', '')
            this.formApi.setValue('CpassWord', '')
      
          } else if (data.CpassWord !== undefined && data.passWord === data.CpassWord) {
            console.log(data)
            let payload = {
              "email": "chutki@gmail.com",
              "password": data.CpassWord
            }
      
            console.log(payload)
      
            let res = await forgotPassword(payload)
            console.log(res)
            if(res.data.statusCode === 1){
              alert(res.data.message)
              this.formApi.reset();
              this.props.props.history.push(`/auth/identifier`)
            }
          } 

  }

 

  setFormApi = (formApi) => {
    this.formApi = formApi;
    console.log(this.formApi)
  }

  render() {
    const { otpFeild, passwordFeild } = this.state

    let readOnly = ""; 
    let readmeOnly = ""
    if (otpFeild) {
      readOnly = "readOnly"
    }
    if (passwordFeild) {
      readmeOnly = "readOnly"
    }

    return (
      <Fragment>
        <h2 className="text-center">Account recovery</h2>
        <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
          {({ formApi, formState }) => (
            <div>
              <Input field="mobile" label="Mobile No" name="mobile" maxLength="10" onChange={this.handleChange} readOnly={readOnly} validateOnBlur validate={e => this.validateProperty('mobile', e)} />

              {otpFeild &&
                <Input field="otp" label="OTP" name="otp" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('otp', e)} readOnly={readmeOnly} />
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

export default ForgotPassword;