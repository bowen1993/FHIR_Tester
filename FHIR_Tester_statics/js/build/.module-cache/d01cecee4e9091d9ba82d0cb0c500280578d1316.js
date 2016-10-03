var account_app = account_app || {};

(function(){
    var LoginWindow = account_app.LoginWindow;
    var RegisterWindow = account_app.RegisterWindow;
    var AccountPage = React.createClass({displayName: "AccountPage",
        getInitialState:function(){
            return {isRegister:false};
        },
        render:function(){
            return (
                React.createElement("div", {className: "index-content"}, 
                    React.createElement("h2", null, this.state.isRegister ? 'Create FHIR Tester Account' : 'Sign in to FHIR Tester'), 
                    this.state.isRegister ? React.createElement(RegisterWindow, null) : React.createElement(LoginWindow, null), 
                    React.createElement("a", {href: ""}, 
                    this.state.isRegister ? 'Sign in with an exist account' : 'Create a new account'
                    ), 
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