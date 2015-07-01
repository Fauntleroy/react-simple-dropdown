var React = require('react');

var DropdownTrigger = React.createClass({
    render: function(){
        var dropdown_trigger_classes = 'dropdown__trigger ' + this.props.className;
        return React.createElement( 'a', {
            className: dropdown_trigger_classes,
            href: '#dropdown-trigger',
            onClick: this.props.onClick
        }, this.props.children );
    }
});

module.exports = DropdownTrigger;