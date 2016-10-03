var account_app = account_app || {};

(function(){
    var LoginWindow = account_app.LoginWindow;
    var AccountPage = React.createClass({displayName: "AccountPage",
        render:function(){
            return (
                React.createElement("div", {className: "index-content"}, 
                    React.createElement(LoginWindow, null)
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