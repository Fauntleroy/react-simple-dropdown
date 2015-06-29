var React = require('react');

var DropdownTrigger = React.createClass({
    render: function(){
        return (
            <a className="dropdown__trigger" href="#dropdown-trigger" onClick={this.props.onClick}>
                {this.props.children}
            </a>
        );
    }
});

module.exports = DropdownTrigger;