var app = app || {};

(function(){
    app.TestButton = React.createClass({displayName: "TestButton",
        handleClick: function() {
            //this.props.submitTestTask(this.props.btnType);

        },
        render: function() {
            return ( React.createElement("button", {onClick:  this.handleClick, 
                className: "btn btn-test"}, " ", React.createElement("span", {className: "btn-test-text"}, " ",  this.props.btn_name, " ")) );

        }
    });
    app.CodeEditor = React.createClass({displayName: "CodeEditor",
        render:function(){
            return (
                React.createElement("div", {id: "codeeditor", ref: "codes", value: "1"})
            );
        }
    });

})();

