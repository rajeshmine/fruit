import React, { PureComponent, Fragment } from 'react';
import { FormGroup, Button } from 'reactstrap';
import { Form } from 'informed';
import Joi from 'joi-browser';

import { Input } from 'components/common/forms/Input';
import { Link } from 'react-router-dom';
import { signUp } from './../service/authService'


class SignUp extends PureComponent {

  state = {
    data: {}
  }

  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name)
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  };


  schema = {
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Mail"),
    contact: Joi.string().min(10).max(10).regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/).required().label("Contact Number"),
    password: Joi.string().required().label("Password"),
    confirmPassword: Joi.string().required().label("Confirm Password"),
  };

  handleChange = async ({ currentTarget: Input }) => {
    const { name, value } = Input;
    const { data } = this.state;
    data[name] = value;
    await this.setState({data})
  }

  setFormApi = (formApi) => {
    this.formApi = formApi;
    console.log(this.formApi)
  }

  onSubmit = async () => {
    const data = this.formApi.getState().values;
    if (data.password !== data.confirmPassword) {
      alert('Password Mismatch')
    } else {
      const { password, name, email, contact } = data
      let payload = {
        "password": password,
        "name": name,
        "email": email,
        "contact": contact,
        "userRole": "U"
      }     
      let res = await signUp(payload)     
      console.log(res)
      if (res.data.statusCode === 1) {
        alert(res.data.message)
        this.resetForm()
        this.props.props.history.push(`/auth/identifier`)
      }
    }
  }

  resetForm = async () => {
    this.formApi.reset();
  } 

  render() {
    return (
      <Fragment >
        <h2 className="text-center">Signup Now</h2>
        <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
          {({ formApi, formState }) => (
            <div>
              <Input field="name" label="Name" name="name" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('name', e)} />
              <Input field="email" label="Email" name="email" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('email', e)} />
              <Input field="contact" label="Contact No" maxLength="10" name="contact" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('contact', e)} />
              <Input field="password" type="password" label="Password" name="password" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('password', e)} />
              <Input field="confirmPassword" type="password" label="Confirm Password" name="confirmPassword" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('confirmPassword', e)} />
              <FormGroup className="text-right">
                <Button type="submit" value="Submit" color="success" size={"sm"} >Submit</Button>
              </FormGroup>

              <div>
                <p>If you have account please login<Link to="/auth/identifier"> here</Link> .</p>
              </div>
            </div>

          )}
        </Form>
      </Fragment>
    );
  }
}

export default SignUp;