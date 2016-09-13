var app = app || {};
//var Codemirror = require('../../node_modules/react-codemirror/dist/react-codemirror.min.js')

(function() {
    app.APP_TEST = 1;
    app.STANDARD_TEST = 0;
    app.SERVER_TEST = 2;
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
        updateUrl:function(newUrl){
            this.setState({url:newUrl});
        },
        handleTaskSubmit:function(submitType){
            //this.state.isLoading = !this.state.isLoading;
            //this.setState({isLoading:!this.state.isLoading});
            var post_data = {code:this.state.code,language:'python',type:submitType,url:this.state.url,access_token :'eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE0NzM0NTA3NTgsImF1ZCI6WyI1NjZkNGNmNy00Zjc0LTRiNmQtOGIxNi1mZmIxZWUxZDBlMjMiXSwiaXNzIjoiaHR0cHM6XC9cL2F1dGhvcml6ZS1kc3R1Mi5zbWFydGhlYWx0aGl0Lm9yZ1wvIiwianRpIjoiNmYyNjc5MTAtYjY2OS00OWNkLTk2ZDMtOTAxMmMyMDUyM2E0IiwiaWF0IjoxNDczNDQ3MTU4fQ.PtzfAKKj_qbK5MaQrvSQDHKODhB31PKyWoyyBknAXClceKyHv6O49QPh-eyp3akx-VZilbzd7gD0CJHY7kmjcPTiB_RSIC16lX_BcU-_ZHDwiTTdChmKvLICW0t2qSx_yBdEAOigfqJawzRdyc6MuPpHVDf4h0hcNIPd-A97Qsk'};
            console.log(post_data);
            $.ajax({
                url:'http://localhost:8000/home/submit',
                type:'POST',
                data:JSON.stringify(post_data),
                dataType:'json',
                cache:false,
                success:function(data){
                    console.log(data)
                }
            });
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
                            <TestButton btn_name="Server Test" submitTestTask={this.handleTaskSubmit} btnType={app.SERVER_TEST}/>
                            <TestButton btn_name="Standard Test" submitTestTask={this.handleTaskSubmit} btnType={app.STANDARD_TEST}/> 
                        </div>
                        <UrlEditor updateUrl={this.updateUrl}/>
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