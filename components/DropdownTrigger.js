var React = require('react');

var DropdownTrigger = React.createClass({
    render: function(){
        return React.createElement( 'a', {
            className: 'dropdown__trigger',
            href: '#dropdown-trigger',
            onClick: this.props.onClick
        }, this.props.children );
    }
});

module.exports = DropdownTrigger;