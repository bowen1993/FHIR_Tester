var account_app = account_app || {};

(function(){
    var action_btn = account_app.action_btn = React.createClass({displayName: "action_btn",
        handleClick:function(){
            this.props.perform_action();
        },
        render:function(){
            return (React.createElement("button", {className: "btn btn-primary", onClick: this.handleClick}, this.props.content));
        }
    });
    var username_field = account_app.username_field = React.createClass({displayName: "username_field",
        handleChange:function(){
            this.props.update_username(this.refs.username.value);
        },
        render:function(){
            return (React.createElement("input", {className: "input-base input-username", ref: "username", placeholder: "Input Username", onChange: this.handleChange}));
        }
    });
    var password_field = account_app.password_field = React.createClass({displayName: "password_field",
        handleChange:function(){
            this.props.update_password(this.refs.pass.value)
        },
    })
})();