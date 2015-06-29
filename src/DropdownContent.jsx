var React = require('react');

var DropdownContent = React.createClass({
    render: function(){
        return (
            <div className="dropdown__content">
                {this.props.children}
            </div>
        );
    }
});

module.exports = DropdownContent;