import React, { Fragment, PureComponent } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';


import Wrapper from 'components/Wrapper';
import Auth from 'auth';
import User from 'components/user'
import UserHome from 'components/userhome'
import Feedback from 'components/common/forms/feedlocation';
import Location from 'components/common/forms/location';
import Profile from 'components/profile'
import { getCurrentUser, getJwt } from 'service/authService';


class App extends PureComponent {

  state = {
    isLogedIn: false,
    isWrapper: false,
    isUser: true
  }

  componentDidMount = async () => {
    await this.verifyUser();
    await this.getUserInfo();
  }


  verifyUser = async () => {
    const isStateCheck = this.stateCheck();
    if (!isStateCheck) {
    } else {
      await this.setState({ isUser: false })
    }
  }

  stateCheck = async () => {
    try {
      let isLogedIn = getCurrentUser();
      return isLogedIn;
    } catch (err) {
      return false;
    }
  }

  getUserInfo = async () => {
    try {
      if (this.stateCheck()) {
        let res = await getJwt('__info');
        const { userRole } = res;
        switch (userRole) {
          case 'A':
          case 'D':
            await this.setState({ isUser: false, isWrapper: true, isLogedIn: true, userRole });
            return;
          case 'U':
            await this.setState({ isUser: true, isWrapper: false, isLogedIn: true, userRole });
            return;
          default:
            await this.setState({ isUser: true, isWrapper: false, isLogedIn: false, userRole });
            break;
        }
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  render() {
    const { isWrapper, isUser, isLogedIn, userRole } = this.state;
    return (
      <Fragment>
        {isWrapper && !isUser && isLogedIn && <Wrapper userRole={userRole} />}
        {!isWrapper && <Switch>
          <Redirect from="/" to="/user/homedetails" exact component={User} />
          <Route path='/' exact component={User} />
          <Route path='/auth/:pageName' exact component={Auth} />

          <Route path='/user/homedetails' exact component={UserHome} />
          <Route path='/user/:pageName' exact component={User} />

          <Route path='/userdetails/:userpageName' exact component={Profile} />
        </Switch>
        }
        <Feedback />
        <Location />
      </Fragment>
    );
  }
}

export default App;
