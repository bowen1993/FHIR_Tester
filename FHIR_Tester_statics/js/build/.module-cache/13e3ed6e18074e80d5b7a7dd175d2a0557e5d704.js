var app = app || {};

(function() {
    app.APP_TEST = 1;
    app.STANDARD_TEST = 2;
    app.SERVER_TEST = 3;
    app.testButton = React.createClass({displayName: "testButton",
        handleClick: function() {
            //this.props.submitTestTask(this.props.btnType);
        },
        render: function() {
            return ( React.createElement("button", {onClick:  this.handleClick, 
                className: "btn btn-test"}, " ", React.createElement("span", {className: "btn-test-text"}, " ",  this.props.btn_name, " ")) );

        }
    });

    function render() {
        React.render( 
            React.createElement("testButton", {btn_name: "App Test"}) ,
            document.getElementById('main')
        );
    }
    render();
})();