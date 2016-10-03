var app = app || {};

(function(){
    var LoginWindow = account_app.LoginWindow;
    var RegisterWindow = account_app.RegisterWindow;
    var AccountPage = React.createClass({displayName: "AccountPage",
        getInitialState:function(){
            return {isRegister:false,password:'', repassword:''};
        },
        hanldeSwitch:function(){
            this.setState({isRegister:!this.state.isRegister});
        },
        render:function(){
            return (
                React.createElement("div", {className: "index-content"}, 
                    React.createElement("h2", null, this.state.isRegister ? 'Create FHIR Tester Account' : 'Sign in to FHIR Tester'), 
                    this.state.isRegister ? React.createElement(RegisterWindow, null) : React.createElement(LoginWindow, null), 
                    React.createElement("a", {href: "javascript:void()", onClick: this.hanldeSwitch}, 
                    this.state.isRegister ? 'Sign in with an exist account' : 'Create a new account'
                    ), 
                    React.createElement("a", {href: "javascript:void()"}, "Continue without account")
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