var React = require('react');

var DropdownContent = React.createClass({
    render: function(){
        return React.createElement( 'div', {
            className: 'dropdown__content'
        }, this.props.children );
    }
});

module.exports = DropdownContent;