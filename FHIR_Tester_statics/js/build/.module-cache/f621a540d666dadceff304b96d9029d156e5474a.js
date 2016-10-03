var app = app || {};
//var Codemirror = require('../../node_modules/react-codemirror/dist/react-codemirror.min.js')

(function() {
    app.APP_TEST = 1;
    app.STANDARD_TEST = 2;
    app.SERVER_TEST = 3;
    var TestButton  = app.TestButton;  
    var CodeEditor = app.CodeEditor; 
    var UrlEditor = app.UrlEditor;
    var ResultDisplay = app.ResultDisplay;
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
            return {code:"",url:"", isResultReady:true, isLoading:false, isTestPass:true, isTestFail:false, testResult:{}};
        },
        updateCode:function(newCode){
            this.state.code = newCode;
        },
        handleTaskSubmit:function(submitType){
            //this.state.isLoading = !this.state.isLoading;
            //this.setState({isLoading:!this.state.isLoading});
            var test_result = {
                testType:'App Test',
                testResult:'Success',
                resultDetail:'All Test Passed'
            }
            this.setState({testResult:test_result})
        },
        render:function(){
            return (
                React.createElement("div", {className: "box"}, 
                    React.createElement("div", {className: "test-input"}, 
                        React.createElement("div", {className: "btnArea"}, 
                            React.createElement(TestButton, {btn_name: "App Test", submitTestTask: this.handleTaskSubmit, btnType: app.APP_TEST}), 
                            React.createElement(TestButton, {btn_name: "Server Test", submitTestTask: this.handleTaskSubmit, btnType: app.APP_TEST}), 
                            React.createElement(TestButton, {btn_name: "Standard Test", submitTestTask: this.handleTaskSubmit, btnType: app.APP_TEST})
                        ), 
                        React.createElement(UrlEditor, null), 
                        React.createElement(CodeEditor, {updateCode: this.updateCode, language: "python"})
                    ), 
                    React.createElement("div", {className: "result-area"}, 
                    React.createElement("div", {className: "loading", hidden: !this.state.isLoading}, 
                        React.createElement("img", {src: "../img/5.png", alt: "loading", class: "img-responsive loading-img"})
                    ), 
                     !this.state.isLoading && this.state.isResultReady ? React.createElement(ResultDisplay, React.__spread({},  this.test_result)) : null
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