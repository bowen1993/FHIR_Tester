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
        handleType:function(){
            this.props.updateCode(this.editor.session.getValue());
        },
        componentDidMount:function(){
            this.editor = ace.edit("codeeditor");
            this.editor.setTheme("ace/theme/xcode");
            this.editor.session.setMode("ace/mode/javascript");
        },
        render:function(){
            return (
                React.createElement("div", {id: "codeeditor", onKeyUp: this.handleType})
            );
        }
    });

})();

