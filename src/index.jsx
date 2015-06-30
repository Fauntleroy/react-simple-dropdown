import React from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import './index.css';

var AccountDropdown = React.createClass({
    render: function () {
        var user = this.props.user;
        return (
            <Dropdown className="account-dropdown">
                <DropdownTrigger>
                    <img className="account-dropdown__avatar" src={user.avatar_url} />
                    <span className="account-dropdown__name">{user.name}</span>
                </DropdownTrigger>
                <DropdownContent>
                    <div className="account-dropdown__identity account-dropdown__segment">
                        Signed in as <strong>{user.name}</strong>
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
                </DropdownContent>
            </Dropdown>
        );
    }
});

var user = {
    name: 'Fauntleroy',
    avatar_url: 'https://avatars2.githubusercontent.com/u/507047?v=3&s=20'
};

React.render( <AccountDropdown user={user} />, document.getElementById('account-dropdown') );