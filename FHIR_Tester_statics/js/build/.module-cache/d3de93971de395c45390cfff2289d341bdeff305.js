var account_app = account_app || {};

(function(){
    var LoginWindow = account_app.LoginWindow;
    var RegisterWindow = account_app.RegisterWindow;
    var AccountPage = React.createClass({displayName: "AccountPage",
        getInitialState:function(){
            return {isRegister:false}
        },
        render:function(){
            return (
                React.createElement("div", {className: "index-content"}, 
                
                    React.createElement("h2", null, "Sign in to FHIR Tester"), 
                    React.createElement(LoginWindow, null), 
                    React.createElement("a", {href: ""}, "Continue without account")
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