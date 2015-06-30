var fs = require('fs'); // brfs doesn't play nice with babelify
import React from 'react';
import AccountDropdown from './components/AccountDropdown.jsx';
import Highlight from 'react-highlight';

var user = {
    name: 'Fauntleroy',
    avatar_url: 'https://avatars2.githubusercontent.com/u/507047?v=3&s=20'
};

var account_dropdown_code = fs.readFileSync( __dirname + '/components/AccountDropdown.jsx', 'UTF8' );

React.render( <AccountDropdown user={user} />, document.getElementById('account-dropdown') );
React.render( (<Highlight className="code jsx">{account_dropdown_code}</Highlight>), document.getElementById('account-dropdown-code') );