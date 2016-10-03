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
        loadClassname:function(){
            return 'input-base input-username' + this.props.classes
        },
        render:function(){
            return (React.createElement("input", {className: "col-lg-8 col-md-8 col-sm-12 col-xs-12", ref: "username", placeholder: "Input Username", onChange: this.handleChange}));
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
    account_app.LoginWindow = React.createClass({displayName: "LoginWindow",
        render:function(){
            return (
                React.createElement("div", {className: "login-area"}, 
                    React.createElement("div", {className: "login-item row"}, 
                        React.createElement("span", {className: "area-title-black hidden-xs hidden-sm"}, "Username"), 
                        React.createElement(Username_field, null)
                    ), 
                    React.createElement("div", {className: "login-item row"}, 
                        React.createElement("span", {className: "area-title-black"}, "Password"), 
                        React.createElement(Password_field, null)
                    )
                )
            );
        }
    });
})();