## React Simple Dropdown

Non-prescriptive React.js dropdown toolkit.

[See it in action (Demo)](http://fauntleroy.github.io/react-simple-dropdown/)

### How to use

This module provides three React components that you can use as a basis for any kind of dropdown menu:

- `DropdownTrigger`: The element that will cause your dropdown to appear when clicked.
- `DropdownContents`: Contains the "filling" of your dropdown. Generally, this is a list of links.
- `Dropdown`: The base element for your dropdown. This contains both the `DropdownTrigger` and the `DropdownContents`, and handles communication between them.

Here's a quick demonstration of how they are used:

```js
var React = require('react');
var Dropdown = require('react-simple-dropdown');
var DropdownTrigger = Dropdown.Trigger;
var DropdownContent = Dropdown.Content;

var Menu = React.createClass({
    render: function () {
        return (
            <Dropdown>
                <DropdownTrigger>Profile</DropdownTrigger>
                <DropdownContent>
                    <img src="avatar.jpg" /> Username
                    <ul>
                        <li>
                            <a href="/profile">Profile</a>
                        </li>
                        <li>
                            <a href="/favorites">Favorites</a>
                        </li>
                        <li>
                            <a href="/logout">Log Out</a>
                        </li>
                    </ul>
                </DropdownContent>
            </Dropdown>
        )
    }
});
```

### Options

Options can be passed to `Dropdown` as props. A list of available options can be found below.

Property | Type | Description
----- | ----- | -----
**show** | *boolean* | Manually show/hide the `DropdownContent`. Make sure to unset this or the dropdown will stay open.
**onShow** | *function* | Callback for when `DropdownContent` is shown.
**onHide** | *function* | Callback for when `DropdownContent` is hidden.