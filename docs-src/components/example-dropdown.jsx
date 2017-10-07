import React from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from '../../lib/components/dropdown.js';

export default function ExampleDropdown (props) {
  return (
    <Dropdown className="example-dropdown" {...props}>
      <DropdownTrigger className="example-dropdown__trigger">
        Dropdown Trigger
      </DropdownTrigger>
      <DropdownContent className="example-dropdown__content">
        Dropdown Content
      </DropdownContent>
    </Dropdown>
  );
}
