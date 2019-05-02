import React, { PureComponent, Fragment } from 'react'

import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Input, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';

import { withRouter, Redirect } from 'react-router-dom'


import { logout } from 'service/authService'



import logo from 'images/favicon.png'
import 'styles/nav.css';

class Header extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  toggle = async () => {
    await this.setState({ isOpen: !this.state.isOpen });
  }

  logout = async () => { 
    await logout();
    return window.location.replace("/user/homedetails") 
  }


  render() {
    return (
      <Fragment>
        <section className="header-section">
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">EasyFruitVeg </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Input className="txt-box" placeholder="Search..." />
                </NavItem>
                <NavItem>
                  <NavLink className="p-0 pl-3 pr-3">
                    <UncontrolledDropdown>
                      <DropdownToggle className="p-0 bg-white border-0" >
                        <img src={logo} className="img-fluid profile-img" alt="Logo Load" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>Profile</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem className="pl-3 text-dark" onClick={this.logout}>Logout</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </NavLink>

                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </section>
      </Fragment>
    )
  }
}

export default Header;