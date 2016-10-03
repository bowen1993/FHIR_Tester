var app = app || {};

(function(){
    var LoginWindow = app.LoginWindow;
    var RegisterWindow = app.RegisterWindow;
    var AccountPage = React.createClass({displayName: "AccountPage",
        getInitialState:function(){
            return {isRegister:false,username:'', password:'', repassword:''};
        },
        hanldeSwitch:function(){
            this.setState({isRegister:!this.state.isRegister});
        },
        handleLogin:function(){
            if(this.state.username.length == 0 || this.state.password.length == 0){
                $('.login-area').shake(5,10,100);
            }
            
        },
        updateUsername:function(new_username){
            this.setState({username:new_username});
        },
        updatePassword:function(new_password){
            this.setState({password:new_password});
        },
        updateRepassword:function(new_repassword){

        },
        render:function(){
            return (
                React.createElement("div", {className: "index-content"}, 
                    React.createElement("h2", null, this.state.isRegister ? 'Create FHIR Tester Account' : 'Sign in to FHIR Tester'), 
                    this.state.isRegister ? React.createElement(RegisterWindow, null) : React.createElement(LoginWindow, {login_action: this.handleLogin}), 
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