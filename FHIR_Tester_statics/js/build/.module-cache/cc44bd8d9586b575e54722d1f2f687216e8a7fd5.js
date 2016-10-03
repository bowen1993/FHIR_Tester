var app = app || {};
//var Codemirror = require('../../node_modules/react-codemirror/dist/react-codemirror.min.js')

(function() {
    app.APP_TEST = 1;
    app.STANDARD_TEST = 2;
    app.SERVER_TEST = 3;
    var TestButton  = app.TestButton;  
    var CodeEditor = app.CodeEditor; 
    function onChange(newCode) {
        console.log(newCode)
    }
    function updateCode(newCode){
        console.log(newCode);
    }
    var options = {
            lineNumbers: true,
            mode:'java'
        };
    var TesterApp = React.createClass({displayName: "TesterApp",
        getInitialState: function() {
            return {code:"",url:"", isResultReady:false, isLoading:false};
        },
        updateCode:function(newCode){
            this.state.code = newCode;
        },
        handleTaskSubmit:function(submitType){
            console.log(submitType, this.state.code);
        },
        render:function(){
            return (
                React.createElement("div", null, 
                    React.createElement("div", {className: "test-input"}, 
                        React.createElement("span", {className: "area-title"}, "Test Script"), 
                        React.createElement(CodeEditor, {updateCode: this.updateCode, language: "python"}), 
                        React.createElement("div", {className: "btnArea"}, 
                        React.createElement("ul", null, 
                            React.createElement("li", null, React.createElement(TestButton, {btn_name: "App Test", submitTestTask: this.handleTaskSubmit, btnType: app.APP_TEST})), 
                            React.createElement("li", null, React.createElement(TestButton, {btn_name: "Server Test", submitTestTask: this.handleTaskSubmit, btnType: app.APP_TEST})), 
                            React.createElement("li", null, React.createElement(TestButton, {btn_name: "Standard Test", submitTestTask: this.handleTaskSubmit, btnType: app.APP_TEST}))
                        )
                        )
                    ), 
                    React.createElement("div", {className: "result-area"}, 
                    React.createElement("div", {className: "loading"}, 
                        React.createElement("img", {src: "../img/5.png", alt: "loading", class: "img-responsive loading-img"}))
                    ), 
                    React.createElement("div", {className: "result"}
                        
                    )
                )
            );
        }
    });
    function render() {
        ReactDOM.render( 
            
            React.createElement(TesterApp, null),
            document.getElementById('main')
        );
    }
    render();
})();