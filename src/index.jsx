import React from 'react';
import Dropdown, { Trigger as DropdownTrigger, Content as DropdownContent } from 'react-simple-dropdown';
import './index.css';

var AccountDropdown = React.createClass({
    render: function () {
        return (
            <Dropdown>
                <DropdownTrigger>
                    <img className="account-dropdown__avatar" src="" />
                    <span className="account-dropdown__name">Fauntleroy</span>
                </DropdownTrigger>
                <DropdownContainer>
                    <div className="account-dropdown__identity account-dropdown__segment">
                        Signed in as <strong>Fauntleroy</strong>
                    </div>
                    <ul className="account-dropdown__quick-links account-dropdown__segment">
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="https://github.com/Fauntleroy/react-simple-dropdown">
                                Your profile
                            </a>
                        </li>
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="https://github.com/Fauntleroy/react-simple-dropdown">
                                Your stars
                            </a>
                        </li>
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="https://github.com/Fauntleroy/react-simple-dropdown">
                                Explore
                            </a>
                        </li>
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="https://github.com/Fauntleroy/react-simple-dropdown">
                                Help
                            </a>
                        </li>
                    </ul>
                    <ul className="account-dropdown__management-links account-dropdown__segment">
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="https://github.com/Fauntleroy/react-simple-dropdown">
                                Settings
                            </a>
                        </li>
                        <li className="account-dropdown__link">
                            <a className="account-dropdown__link__anchor" href="https://github.com/Fauntleroy/react-simple-dropdown">
                                Sign out
                            </a>
                        </li>
                    </ul>
                </DropdownContainer>
            </Dropdown>
        );
    }
});

React.render( AccountDropdown, document.getElementById('account-dropdown') );