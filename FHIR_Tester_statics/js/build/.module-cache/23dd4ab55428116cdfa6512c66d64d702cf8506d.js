var account_app = account_app || {};

(function(){
    var Login_window = account_app.Login_window;
    var Account_page = React.createClass({displayName: "Account_page",
        render:function(){
            React.createElement("div", {className: "index-content"}, 
                React.createElement(Login_window, null)
            )
        }
    });
    function render() {
        ReactDOM.render( 
            React.createElement(Account_page, null),
            document.getElementById('main')
        );
    }
    render();
})();