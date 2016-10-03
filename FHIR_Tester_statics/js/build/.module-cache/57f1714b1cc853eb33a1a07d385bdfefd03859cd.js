var app = app || {};

(function(){
    var Action_btn = app.Action_btn = React.createClass({displayName: "Action_btn",
        handleClick:function(){
            this.props.perform_action();
        },
        render:function(){
            return (React.createElement("button", {className: "btn btn-primary", onClick: this.handleClick}, this.props.content));
        }
    });
    var Username_field = app.Username_field = React.createClass({displayName: "Username_field",
        handleChange:function(){
            this.props.update_username(this.refs.username.value);
        },
        render:function(){
            return (React.createElement("input", {className: "input-base input-username", ref: "username", placeholder: this.props.hint, onChange: this.handleChange}));
        }
    });
    var Password_field = app.Password_field = React.createClass({displayName: "Password_field",
        handleChange:function(){
            this.props.update_password(this.refs.pass.value);
        },
        render:function(){
            return (React.createElement("input", {className: "input-base input-password", ref: "pass", type: "password", placeholder: this.props.hint, onChange: this.handleChange}))
        }
    });
    app.RegisterWindow = React.createClass({displayName: "RegisterWindow",
        render:function(){
            return (
                React.createElement("div", {className: "register-area"}, 
                    React.createElement("div", {className: "register-item"}, 
                        React.createElement(Username_field, {update_username: this.props.updateUsername, hint: "Username"})
                    ), 
                    React.createElement("div", {className: "register-item"}, 
                        React.createElement(Password_field, {update_password: this.props.updatePassword, hint: "Password"})
                    ), 
                    React.createElement("div", {className: "register-item"}, 
                        React.createElement(Password_field, {update_password: this.props.updateRepassword, hint: "Confirm Your Password"})
                    ), 
                    React.createElement("div", {className: "register-item right-align"}, 
                        React.createElement(Action_btn, {perform_action: this.props.register_action, content: "Register"})
                    )
                )
            );
        }
    });
    app.LoginWindow = React.createClass({displayName: "LoginWindow",
        render:function(){
            return (
                React.createElement("div", {className: "login-area"}, 
                    React.createElement("div", {className: "login-item"}, 
                        React.createElement(Username_field, {hint: "Username"})
                    ), 
                    React.createElement("div", {className: "login-item"}, 
                        React.createElement(Password_field, {hint: "Password"})
                    ), 
                    React.createElement("div", {className: "login-item right-align"}, 
                        React.createElement(Action_btn, {content: "Login", perform_action: this.props.login_action})
                    )
                )
            );
        }
    });
})();