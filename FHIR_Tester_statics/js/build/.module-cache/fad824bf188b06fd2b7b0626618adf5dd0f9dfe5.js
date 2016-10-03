var app = app || {};

(function() {
    app.APP_TEST = 1;
    app.STANDARD_TEST = 2;
    app.SERVER_TEST = 3;
    var TestButton = React.createClass({displayName: "TestButton",
        handleClick: function() {
            console.log(1);
            //this.props.submitTestTask(this.props.btnType);
            console.log(this.props);
        },
        render: function() {
            return ( React.createElement("button", {onClick:  this.handleClick, 
                className: "btn btn-test"}, " ", React.createElement("span", {className: "btn-test-text"}, " ",  this.props.btn_name, " ")) );

        }
    });
    
    function render() {
        ReactDOM.render( 
            React.createElement(TestButton, {btn_name: "App Test", btnType: app.APP_TEST}) ,
            document.getElementById('main')
        );
    }
    render();
})();