var account_app = account_app || {};

(function(){
    var Action_btn = account_app.Action_btn = React.createClass({displayName: "Action_btn",
        handleClick:function(){
            this.props.perform_action();
        },
        render:function(){
            return (React.createElement("button", {className: "btn btn-primary", onClick: this.handleClick}, this.props.content));
        }
    });
    var Username_field = account_app.Username_field = React.createClass({displayName: "Username_field",
        handleChange:function(){
            this.props.update_username(this.refs.username.value);
        },
        render:function(){
            return (React.createElement("input", {className: "input-base input-username", ref: "username", placeholder: "Input Username", onChange: this.handleChange}));
        }
    });
    var Password_field = account_app.Password_field = React.createClass({displayName: "Password_field",
        handleChange:function(){
            this.props.update_password(this.refs.pass.value);
        },
        render:function(){
            return (React.createElement("input", {className: "input-base input-password", ref: "pass", type: "password", placeholder: "Input password", onChange: this.handleChange}))
        }
    });
    account_app.Login_window = React.createClass({displayName: "Login_window",
        render:function(){
            return (
                React.createElement("div", {className: "login-area"}, 
                    React.createElement("div", {className: "login-item row"}
                    )
                )
            );
        }
    });
})();