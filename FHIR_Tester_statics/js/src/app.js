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
    app.type2str = function(test_type){
        var typeStr = '';
        switch (test_type)
        {
            case app.APP_TEST:
            typeStr = 'App Test';
            break;
            case app.STANDARD_TEST:
            typeStr = 'Standard Test';
            break;
            case app.SERVER_TEST:
            typeStr = 'Server Test';
            break;
        }
        return typeStr;
    }
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
    var TesterApp = React.createClass({
        getInitialState: function() {
            return {code:"",url:"", isResultReady:true, isLoading:false, isTestPass:true, isTestFail:false, testResult:{}};
        },
        updateCode:function(newCode){
            this.setState({code:newCode});

        },
        handleTaskSubmit:function(submitType){
            //this.state.isLoading = !this.state.isLoading;
            //this.setState({isLoading:!this.state.isLoading});
            var test_result = {
                testType:app.type2str(submitType),
                testResult:'Success',
                resultDetail:'All Test Passed'
            }
            this.setState({testResult:test_result})
        },
        render:function(){
            return (
                <div className="box">
                    <div className="test-input">
                        <div className="btnArea">
                            <TestButton btn_name="App Test" submitTestTask={this.handleTaskSubmit} btnType={app.APP_TEST}/>
                            <TestButton btn_name="Server Test" submitTestTask={this.handleTaskSubmit} btnType={app.STANDARD_TEST}/>
                            <TestButton btn_name="Standard Test" submitTestTask={this.handleTaskSubmit} btnType={app.SERVER_TEST}/> 
                        </div>
                        <UrlEditor />
                        <CodeEditor updateCode={this.updateCode} language="python"/>
                    </div>
                    <div className="result-area">
                    <div className="loading" hidden={!this.state.isLoading}>
                        <img src="../img/5.png" alt="loading" class="img-responsive loading-img" />
                    </div> 
                    { !this.state.isLoading && this.state.isResultReady ? <ResultDisplay {...this.state.testResult}/> : null }
                    </div>
                </div>
            );
        }
    });
    function render() {
        ReactDOM.render( 
            <TesterApp />,
            document.getElementById('main')
        );
    }
    render();
})();