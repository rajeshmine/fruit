import React, { PureComponent, Fragment } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label, Input } from 'reactstrap';
import _ from 'lodash';

import 'styles/filter.css';

class Filter extends PureComponent {


  renderForm = () => {
    const { options, checkBox } = this.props;
    if (!checkBox)
      return _.map(options, (v, i) => <DropdownItem key={`filter` + i} >{v} </DropdownItem>)
    return _.map(options, (v, i) => <FormGroup check key={`filter` + i} > <Label check> <Input type="checkbox" />{v}</Label></FormGroup>)
  }



  render() {
    const { title } = this.props;
    return (
      <Fragment>
        <UncontrolledDropdown size="sm">
          <DropdownToggle caret color="light" >{title} </DropdownToggle>
          <DropdownMenu>
            {this.renderForm()}
          </DropdownMenu>
        </UncontrolledDropdown>
      </Fragment>
    )
  }
}

export default Filter;