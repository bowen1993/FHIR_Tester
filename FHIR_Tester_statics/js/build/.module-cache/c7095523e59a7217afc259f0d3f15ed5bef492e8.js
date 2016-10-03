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
    var TokenEditor = app.TokenEditor;
    var UserBtnArea = app.UserBtnArea;
    var Modal = app.Modal;
    var HistoryViewer = app.HistoryViewer;
    var ServerList = app.ServerList
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
    var TesterApp = React.createClass({displayName: "TesterApp",
        getInitialState: function() {
            return {code:"",url:"", isResultReady:true, isLoading:false, isTestPass:true, isTestFail:false, testResult:{}, access_token:'', is_history_show:false, isEditting:false};
        },
        updateCode:function(newCode){
            this.setState({code:newCode});

        },
        showHistoryView:function(){
            this.setState({is_history_show:!this.state.is_history_show});
        },
        updateUrl:function(newUrl){
            this.setState({url:newUrl});
        },
        updateAccessToken:function(newToken){
            this.setState({access_token:newToken});
        },
        handleTaskSubmit:function(submitType){
            //this.state.isLoading = !this.state.isLoading;
            //this.setState({isLoading:!this.state.isLoading});
            var token = $.cookie('fhir_token');
            var post_data = {code:this.state.code,language:'python',type:submitType,url:this.state.url,access_token :this.state.access_token, token:token};
            console.log(post_data);
            this.setState({isLoading:true});
            $.ajax({
                url:'http://localhost:8000/home/submit',
                type:'POST',
                data:JSON.stringify(post_data),
                dataType:'json',
                cache:false,
                success:function(data){
                    console.log(data);
                    app.setup_websocket(data.task_id, 1)
                    // var task_id = data.task_id;
                    // var ws_scheme = window.location.protocol == "https" ? "wss" : "ws";
                    // var tasksocket = new WebSocket(ws_scheme + '://localhost:8000/task/' + task_id);
                    // tasksocket.onmessage = function(message){
                    //     var data = JSON.parse(message.data);
                    //     //console.log(data);
                    //     window.comp.setState({isLoading:false});
                    //     window.comp.updateTestResult(data);
                    // };
                    // tasksocket.onopen = function(e){
                    //     tasksocket.send(task_id, 1);
                    // }
                }
            });
            //connect with websocket
        },
        componentDidMount:function(){
            window.comp = this;
        },
        updateTestResult:function(res){
            this.setState({isResultReady:true, testResult:res, isLoading:false});
            this.refs.res_area.displayResult(res);
        },
        handleHideModal(){
            this.setState({is_history_show:false});
        },
        render:function(){
            return (
                React.createElement("div", {className: "box"}, 
                    React.createElement(UserBtnArea, {history_action: this.showHistoryView}), 
                    React.createElement("div", {className: "test-input"}, 
                        React.createElement(ServerList, null), 
                        React.createElement("div", {className: "btnArea"}, 
                            React.createElement(TestButton, {btn_name: "App Test", submitTestTask: this.handleTaskSubmit, btnType: app.APP_TEST}), 
                            React.createElement(TestButton, {btn_name: "Server Test", submitTestTask: this.handleTaskSubmit, btnType: app.SERVER_TEST}), 
                            React.createElement(TestButton, {btn_name: "Standard Test", submitTestTask: this.handleTaskSubmit, btnType: app.STANDARD_TEST})
                        ), 
                        React.createElement("div", {className: "btnArea"}, 
                            React.createElement("label", null, 
                                React.createElement("input", {type: "checkbox"}), " Code Eidtor"
                            )

                        ), 
                        React.createElement(UrlEditor, {updateUrl: this.updateUrl}), 
                        React.createElement(TokenEditor, {updateToken: this.updateAccessToken}), 
                        
                        this.state.isEditting ? React.createElement(CodeEditor, {updateCode: this.updateCode, language: "python"}) : null
                    ), 
                    React.createElement("div", {className: "result-area"}, 
                    this.state.isLoading ? React.createElement("div", {className: "loading"}, React.createElement("img", {src: "../img/5.png", alt: "loading", class: "img-responsive loading-img"}))  : null, 
                     !this.state.isLoading && this.state.isResultReady ? React.createElement(ResultDisplay, {ref: "res_area"}) : null
                    ), 
                    this.state.is_history_show ? React.createElement(Modal, {handleHideModal: this.handleHideModal, title: "History", content: React.createElement(HistoryViewer, null)}) : null
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