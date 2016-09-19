var app = app || {};

(function(){
    var Action_btn = app.Action_btn = React.createClass({
        handleClick:function(){
            this.props.perform_action();
        },
        render:function(){
            return (<button className="btn btn-primary" onClick={this.handleClick}>{this.props.content}</button>);
        }
    });
    var Username_field = app.Username_field = React.createClass({
        handleChange:function(){
            this.props.update_username(this.refs.username.value);
        },
        render:function(){
            return (<input className="input-base input-username" ref="username" placeholder={this.props.hint} onChange={this.handleChange}/>);
        }
    });
    var Password_field = app.Password_field = React.createClass({
        handleChange:function(){
            this.props.update_password(this.refs.pass.value);
        },
        render:function(){
            return (<input className="input-base input-password" ref="pass" type="password" placeholder={this.props.hint} onChange={this.handleChange}/>)
        }
    });
    app.RegisterWindow = React.createClass({
        render:function(){
            return (
                <div className="register-area">
                    <div className="register-item">
                        <Username_field update_username={this.props.updateUsername} hint="Username" />
                    </div>
                    <div className="register-item">
                        <Password_field update_password={this.props.updatePassword} hint="Password"/>
                    </div>
                    <div className="register-item">
                        <Password_field update_password={this.props.updateRepassword} hint="Confirm Your Password" />
                    </div>
                    <div className="register-item right-align">
                        <Action_btn perform_action={this.props.register_action} content="Register" />
                    </div>
                </div>
            );
        }
    });
    app.LoginWindow = React.createClass({
        render:function(){
            return (
                <div className="login-area">
                    <div className="login-item">
                        <Username_field update_username={this.props.updateUsername} hint="Username"/>
                    </div>
                    <div className="login-item">
                        <Password_field update_password={this.props.updatePassword} hint="Password"/>
                    </div>
                    <div className="login-item right-align">
                        <Action_btn content="Login" perform_action={this.props.login_action}/>
                    </div>
                </div>
            );
        }
    });
})();