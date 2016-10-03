var account_app = account_app || {};

(function(){
    var Login_window = account_app.Login_window;
    var AccountPage = React.createClass({displayName: "AccountPage",
        render:function(){
            return (
            React.createElement("div", {className: "index-content"}, 
                React.createElement(Login_window, null)
            )
            );
        }
    });
    function render() {
        ReactDOM.render( 
            React.createElement(AccountPage, null),
            document.getElementById('main')
        );
    }
    render();
})();