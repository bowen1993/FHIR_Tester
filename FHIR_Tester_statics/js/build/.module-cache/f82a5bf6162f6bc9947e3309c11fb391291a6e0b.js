var account_app = account_app || {};

(function(){
    var action_btn = account_app.action_btn = React.createClass({displayName: "action_btn",
        handleClick:function(){
            this.props.perform_action();
        },
        render:function(){
            return (React.createElement("button", {className: "btn btn-primary", onClick: this.handleClick}, this.props.content));
        }
    })
})();