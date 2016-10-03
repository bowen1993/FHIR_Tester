var app = app || {};

(function(){
    var LoginWindow = app.LoginWindow;
    var RegisterWindow = app.RegisterWindow;
    var AccountPage = React.createClass({displayName: "AccountPage",
        getInitialState:function(){
            return {isRegister:false,username:'', password:'', repassword:''};
        },
        hanldeSwitch:function(){
            this.setState({isRegister:!this.state.isRegister,username:'', password:'', repassword:''});
        },
        handleLogin:function(){
            if(this.state.username.length == 0 || this.state.password.length == 0){
                $('.login-area').shake(5,10,100);
                app.showMsg('Please input username and password')
            }else{
                var post_data = {
                    'username':this.state.username,
                    'password':this.state.password
                }
                $.ajax({
                    url:'http://localhost:8000/account/login',
                    type:'POST',
                    data:JSON.stringify(post_data),
                    dataType:'json',
                    cache:false,
                    success:function(data){
                        if (data.isSuccessful){
                            window.location.href = '/html/dashboard.html';
                        }else{
                             $('.login-area').shake(5,10,100);
                            app.showMsg(data.error);
                        }
                    }
                });
            }
            
        },
        handleRegister:function(){
            if(this.state.username.length == 0 || this.state.password.length == 0 || this.state.password != this.state.repassword){
                $('.register-area').shake(5,10,100);
                app.showMsg('Please input username and password');
            }else{
                
            }
        },
        updateUsername:function(new_username){
            this.setState({username:new_username});
        },
        updatePassword:function(new_password){
            this.setState({password:new_password});
        },
        updateRepassword:function(new_repassword){
            this.setState({repassword:new_repassword});
        },
        render:function(){
            return (
                React.createElement("div", {className: "index-content"}, 
                    React.createElement("h2", null, this.state.isRegister ? 'Create FHIR Tester Account' : 'Sign in to FHIR Tester'), 
                    this.state.isRegister ? React.createElement(RegisterWindow, {register_action: this.handleRegister, updateUsername: this.updateUsername, updatePassword: this.updatePassword, updateRepassword: this.updateRepassword}) : React.createElement(LoginWindow, {login_action: this.handleLogin, updateUsername: this.updateUsername, updatePassword: this.updatePassword}), 
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