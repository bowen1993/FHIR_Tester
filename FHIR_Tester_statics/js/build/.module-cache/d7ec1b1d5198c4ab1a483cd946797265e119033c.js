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
            return {code:"",};
        },
        render:function(){
            return (
                React.createElement(CodeEditor, null)
            );
        }
    });
    function render() {
        ReactDOM.render( 
            //<TestButton btn_name="App Test" btnType={app.APP_TEST}/> ,
            React.createElement(TesterApp, null),
            document.getElementById('main')
        );
    }
    render();
})();