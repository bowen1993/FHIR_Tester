var app = app || {};

(function() {
    app.test_button = React.createClass({displayName: "test_button",
        handleClick: function(code_str, url) {
            console.log(code_str);
            console.log(url);
            //TODO: add ajax request to server
        },
        render: function() {
            return ( React.createElement("button", {className: "btn btn-test"}, " ", React.createElement("span", {className: "btn-test-text"}, " ",  this.props.btn_name, " ")) );
        }
    });

})();