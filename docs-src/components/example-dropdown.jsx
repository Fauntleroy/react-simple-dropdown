import React, { Component } from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from '../../lib/components/Dropdown.js';

class ExampleDropdown extends Component {
  constructor (props) {
    super(props);

    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick () {
    this.refs.dropdown.hide();
  }

  render () {
    return (
      <Dropdown className="example-dropdown" ref="dropdown" {...this.props}>
        <DropdownTrigger className="example-dropdown__trigger">
          Dropdown Trigger
        </DropdownTrigger>
        <DropdownContent className="example-dropdown__content">
          Dropdown Content
        </DropdownContent>
      </Dropdown>
    );
  }
}

export default ExampleDropdown;
