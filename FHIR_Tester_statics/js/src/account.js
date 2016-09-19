var app = app || {};

(function(){
    var LoginWindow = app.LoginWindow;
    var RegisterWindow = app.RegisterWindow;
    var AccountPage = React.createClass({
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
            }
            
        },
        handleRegister:function(){
            if(this.state.username.length == 0 || this.state.password.length == 0 || this.state.password != this.state.repassword){
                $('.register-area').shake(5,10,100);
                app.showMsg('Please input username and password');
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
                <div className="index-content">
                    <h2>{this.state.isRegister ? 'Create FHIR Tester Account' : 'Sign in to FHIR Tester'}</h2>
                    {this.state.isRegister ? <RegisterWindow register_action={this.handleRegister} updateUsername={this.updateUsername} updatePassword={this.updatePassword} updateRepassword={this.updateRepassword}/> : <LoginWindow login_action={this.handleLogin} updateUsername={this.updateUsername} updatePassword={this.updatePassword}/>}
                    <a href="javascript:void()" onClick={this.hanldeSwitch}>
                    {this.state.isRegister ? 'Sign in with an exist account' : 'Create a new account'}
                    </a>
                    <a href="javascript:void()">Continue without account</a>
                </div>
            );
        }
    });
    function render() {
        ReactDOM.render( 
            <AccountPage />,
            document.getElementById('main')
        );
    }
    render();
})();