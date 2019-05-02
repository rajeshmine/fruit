import React, { PureComponent, Fragment } from 'react';

import { Stepper, Step, StepLabel, StepContent } from '@material-ui/core';
import _ from 'lodash';


import Items from 'components/profile/Items'
import Address from 'components/profile/Address'
import Payment from 'components/payment';

import { getJwt } from 'service/authService';

function getSteps() {
  return ['Order Summary', 'Delivery Address', 'Payment Options'];
}

class Cart extends PureComponent {
  state = {
    activeStep: 0,
    cartItems: [],
    addressInfo: {},
    cartData: {
      email: 'veera@gmail.com',
      mobileno: 9865986598
    }
  };

  componentDidMount = () => {
    this.getUserInfo()
  }

  getUserInfo = async () => {
    let res = await getJwt('__info');
    console.log(res)
    const { uid } = res;
    await this.setState({ uid: uid, userInfo: res });
    await this.getAddressInfo();
  }


  getAddressInfo = async () => {
    const { userInfo, cartItems } = this.state;
    let temp = [];
    // temp.push(userInfo.address1);
    // temp.push(userInfo.address2);

    temp.push("The Chennai Silks, Hosur, Tamil Nadu, India");
    temp.push(" The Chennai Silks, Hosur, Tamil Nadu, India");
    let obj = {
      addressList: _.compact(temp),
      cartItems: cartItems
    };
    await this.setState({ addressInfo: obj || [] });
  }


  getStepContent(step) {
    const { addressInfo, uid, cartData } = this.state;
    switch (step) {
      case 0:
        return <Items uid={uid} handleNext={this.handleNext} cartDataStore={this.cartDataStore} />
      case 1:
        return <Address data={addressInfo} refresh={this.getAddressInfo} cartDataStore={this.cartDataStore} handleBack={this.handleBack} handleNext={this.handleNext} uid={uid} />
      case 2:
        return <Payment handleBack={this.handleBack} data={cartData} props={this.props.props} />
      default:
        return 'Unknown step';
    }
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleError = err => {
    console.log(err)
  }

  cartDataStore = async (value) => {
    let { cartData } = this.state;
    await _.assign(cartData, value);
    await this.setState({ cartData });
  }


  render() {
    const steps = getSteps();
    const { activeStep } = this.state;
    return (
      <Fragment>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel className="step-label">{label}</StepLabel>
              <StepContent>
                <div>{this.getStepContent(index)}</div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {/* {activeStep === steps.length && (
          <Paper square elevation={0}>
            <p>All steps completed - you&apos;re finished</p>
            <Button onClick={this.handleReset} >Reset</Button>
          </Paper>
        )} */}
      </Fragment>
    )
  }
}

export default Cart;