var app = app || {};

(function() {
    app.APP_TEST = 1;
    app.STANDARD_TEST = 2;
    app.SERVER_TEST = 3;
    app.test_button = React.createClass({displayName: "test_button",
        handleClick: function() {
            this.props.submitTestTask(this.props.btnType);
                
        },
        render: function() {
            return ( React.createElement("button", {className: "btn btn-test"}, " ", React.createElement("span", {className: "btn-test-text"}, " ",  this.props.btn_name, " ")) );
        }
    });

})();