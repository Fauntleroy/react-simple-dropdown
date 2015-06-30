import React from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

var AccountDropdown = React.createClass({
    render: function () {
        var user = this.props.user;
        return (
            <Dropdown className="account-dropdown">
                <DropdownTrigger>
                    <img className="account-dropdown__avatar" src={user.avatar_url} /><span className="account-dropdown__name">My Account</span>
                </DropdownTrigger>
                <DropdownContent>
                    <div className="account-dropdown__identity account-dropdown__segment">
                        Signed in as <strong>{user.name}</strong>
                    </div>
                    <ul className="account-dropdown__quick-links account-dropdown__segment">
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="#">
                                Your profile
                            </a>
                        </li>
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="#">
                                Your stars
                            </a>
                        </li>
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="#">
                                Explore
                            </a>
                        </li>
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="#">
                                Help
                            </a>
                        </li>
                    </ul>
                    <ul className="account-dropdown__management-links account-dropdown__segment">
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="#">
                                Settings
                            </a>
                        </li>
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="#">
                                Sign out
                            </a>
                        </li>
                    </ul>
                </DropdownContent>
            </Dropdown>
        );
    }
});

export default AccountDropdown;