var account_app = account_app || {};

(function(){
    var Login_window = account_app.Login_window;
    var account_page = React.createClass({displayName: "account_page",
        render:function(){
            React.createElement("div", {className: "index-content"}, 
                React.createElement(Login_window, null)
            )
        }
    });
    function render() {
        ReactDOM.render( 
            React.createElement(TesterApp, null),
            document.getElementById('main')
        );
    }
    render();
})();