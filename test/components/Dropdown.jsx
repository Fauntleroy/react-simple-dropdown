var test = require('tape');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var smock = require('simple-mock');
var domClasses = require('dom-classes');
var hasClass = domClasses.has;

var Dropdown = require('../../components/Dropdown.js');
var DropdownTrigger = Dropdown.DropdownTrigger;
var DropdownContent = Dropdown.DropdownContent;

var TestApp = React.createClass({
    getInitialState: function(){
        return {};
    },
    render: function(){
        return (
            <Dropdown
                className={this.state.className}
                active={this.state.active}
                onShow={this.state.onShow}
                onHide={this.state.onHide}
            >
                <DropdownTrigger></DropdownTrigger>
                <DropdownContent></DropdownContent>
            </Dropdown>
        );
    }
});
var test_app = TestUtils.renderIntoDocument( <TestApp /> );
var dropdown = TestUtils.findRenderedComponentWithType( test_app, Dropdown );
var dropdown_element = TestUtils.findRenderedDOMComponentWithClass( dropdown, 'dropdown' );
var dropdown_element_dom_node = React.findDOMNode( dropdown_element );
var trigger = TestUtils.findRenderedComponentWithType( test_app, DropdownTrigger );
var trigger_element = TestUtils.findRenderedDOMComponentWithClass( trigger, 'dropdown__trigger' );
var content = TestUtils.findRenderedComponentWithType( test_app, DropdownContent );
var content_element = TestUtils.findRenderedDOMComponentWithClass( content, 'dropdown__content' );

test( 'Merges classes from props with default element class', function( t ){
    t.plan( 3 );
    t.equal( domClasses( dropdown_element_dom_node ).length, 1, 'has one class when `className` is empty' );
    test_app.setState({
        className: 'test'
    });
    t.ok( hasClass( dropdown_element_dom_node, 'dropdown' ), 'has class `dropdown`' );
    t.ok( hasClass( dropdown_element_dom_node, 'test' ), 'has class `test`' );
    test_app.setState({
        className: null
    });
});

test( 'Dropdown is toggled when DropdownTrigger is clicked', function( t ){
    t.plan( 4 );
    var onShowCallback = smock.stub();
    var onHideCallback = smock.stub();
    test_app.setState({
        onShow: onShowCallback,
        onHide: onHideCallback
    });
    TestUtils.Simulate.click( trigger_element );
    t.ok( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'has class `dropdown--active` after trigger is clicked' );
    t.equal( onShowCallback.callCount, 1, '`onShow` function was called' );
    TestUtils.Simulate.click( trigger_element );
    t.notOk( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'does not have class `dropdown--active` after trigger is clicked again' );
    t.equal( onHideCallback.callCount, 1, '`onHide` function was called' );
    test_app.setState({
        onShow: null,
        onHide: null
    });
});

test( 'Dropdown state can be manually set with props', function( t ){
    t.plan( 2 );
    test_app.setState({
        active: true
    });
    t.ok( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'has class `dropdown--active` when `active` is set to `true`' );
    test_app.setState({
        active: false
    });
    t.notOk( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'does not have class `dropdown--active` when `active` is set to `false`' );
    test_app.setState({
        active: null
    });
});

test( 'Dropdown hides itself when area outside dropdown is clicked', function( t ){
    t.plan( 2 );
    dropdown.setState({
        active: true
    });
    TestUtils.Simulate.click( content_element );
    t.ok( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'has class `dropdown--active` after content element is clicked' );
    document.body.click();
    t.notOk( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'does not have class `dropdown--active` after document body is clicked' );
});