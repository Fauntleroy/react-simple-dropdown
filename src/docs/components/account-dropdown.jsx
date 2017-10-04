import React, { Component } from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from '../../../lib/components/Dropdown.js';

const user = {
  avatarUrl: 'https://avatars0.githubusercontent.com/u/507047?v=4&s=40',
  name: 'Timothy Kempf'
};

class AccountDropdown extends Component {
  constructor (props) {
    super(props);

    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick () {
    this.refs.dropdown.hide();
  }

  render () {
    return (
      <Dropdown className="account-dropdown" ref="dropdown" {...this.props}>
        <DropdownTrigger>
          <img className="account-dropdown__avatar" src={user.avatarUrl} /><span className="account-dropdown__name">My Account</span>
        </DropdownTrigger>
        <DropdownContent>
          <div className="account-dropdown__identity account-dropdown__segment">
            Signed in as <strong>{user.name}</strong>
          </div>
          <ul className="account-dropdown__quick-links account-dropdown__segment">
            <li className="account-dropdown__link">
              <a className="account-dropdown__link__anchor" href="#" onClick={this.handleLinkClick}>
                Your profile
              </a>
            </li>
            <li className="account-dropdown__link">
              <a className="account-dropdown__link__anchor" href="#" onClick={this.handleLinkClick}>
                Your stars
              </a>
            </li>
            <li className="account-dropdown__link">
              <a className="account-dropdown__link__anchor" href="#" onClick={this.handleLinkClick}>
                Explore
              </a>
            </li>
            <li className="account-dropdown__link">
              <a className="account-dropdown__link__anchor" href="#" onClick={this.handleLinkClick}>
                Help
              </a>
            </li>
          </ul>
          <ul className="account-dropdown__management-links account-dropdown__segment">
            <li className="account-dropdown__link">
              <a className="account-dropdown__link__anchor" href="#" onClick={this.handleLinkClick}>
                Settings
              </a>
            </li>
            <li className="account-dropdown__link">
              <a className="account-dropdown__link__anchor" href="#" onClick={this.handleLinkClick}>
                Sign out
              </a>
            </li>
          </ul>
        </DropdownContent>
      </Dropdown>
    );
  }
}

export default AccountDropdown;
