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
            console.log(this.props.code);
        },
        componentDidMount:function(){
            var editor = ace.edit("codeeditor");
            editor.setTheme("ace/theme/dawn");
            editor.session.setMode("ace/mode/javascript");
            console.log(editor);
        },
        render:function(){
            return (
                React.createElement("div", {id: "codeeditor", onKeyPress: this.handleType, ref: "codes"}, this.props.code)
            );
        }
    });

})();

