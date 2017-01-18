var app = app || {};
//var Codemirror = require('../../node_modules/react-codemirror/dist/react-codemirror.min.js')

(function() {
    app.APP_TEST = 1;
    app.STANDARD_TEST = 0;
    app.SERVER_TEST = 2;
    app.FHIR_TEST = 3;
    var TestButton  = app.TestButton;  
    var CodeEditor = app.CodeEditor; 
    var UrlEditor = app.UrlEditor;
    var ResultDisplay = app.ResultDisplay;
    var TokenEditor = app.TokenEditor;
    var UserBtnArea = app.UserBtnArea;
    var Modal = app.Modal;
    var HistoryViewer = app.HistoryViewer;
    var ServerList = app.ServerList
    var TaskSearchView = app.TaskSearchView;
    var FullyDetail = app.FullyDetail;
    var ReportView = app.ReportView;
    var SideMenuButton = app.SideMenuButton;
    var MatrixArea = app.MatrixArea;
    var ServerView = app.ServerView;
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
            mode:'python'
        };
    var TesterApp = React.createClass({displayName: "TesterApp",
        getInitialState: function() {
            return {resources:[],isReportReady:false,test_report:{},code:"",url:"", test_type:'', isResultReady:true, isLoading:false, isTestPass:true, isTestFail:false,chosen_server:-1, access_token:null, is_history_show:false, isEditting:false, isCustomedURL:false, isSearchShow:false, isDetailShow:false, isServerBoxShow:false , isReportShow:false,isRMatrixShow:false};
        },
        updateCode:function(newCode){
            this.setState({code:newCode});
        },
        showHistoryView:function(){
            this.setState({is_history_show:!this.state.is_history_show});
        },
        showSearchView:function(){
            this.setState({isSearchShow:!this.state.isSearchShow});
        },
        showReportView:function(report_info){
            this.setState({isReportShow:true, test_report:report_info,isReportReady:true});
        },
        updateUrl:function(newUrl){
            this.setState({url:newUrl});
        },
        updateAccessToken:function(newToken){
            this.setState({access_token:newToken});
        },
        handleTaskSubmit:function(submitType, resource=[]){
            //this.state.isLoading = !this.state.isLoading;
            //this.setState({isLoading:!this.state.isLoading});
            // console.log(resource);
            this.refs.res_area.emptyCurrentDisplay();
            var token = $.cookie('fhir_token');
            if( this.state.isCustomedURL ){
                var post_data = {curr_detail:null,code:this.state.code,language:'python',type:submitType,url:this.state.url,access_token :this.state.access_token, token:token};
            }else{
                if( this.state.chosen_server == -1 ){
                    app.showMsg("Please Choose a Server or Input one");
                    return
                }else{
                    var post_data = {code:this.state.code,language:'python',type:submitType,chosen_server:this.state.chosen_server, token:token};
                }
            }
            post_data['resources'] = resource;
            console.log(post_data['resources']);
            console.log(post_data);
            var self = this;
            this.setState({isLoading:true});
            $.ajax({
                url:app.host+ '/home/submit',
                type:'POST',
                data:JSON.stringify(post_data),
                dataType:'json',
                cache:false,
                success:function(data){
                    console.log(data);
                    if( data.isSuccessful ){
                        app.setup_websocket(data.task_id, 1)
                    }else{
                        self.setState({isLoading:false});
                        app.showMsg(data.error);
                    }
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
            this.setState({isResultReady:true, isLoading:false});
            this.refs.res_area.displayResult(res);
            this.refs.full_detail.updateDetail(res.steps);
        },
        handleHideModal(){
            this.setState({is_history_show:false});
        },
        handleSearchHideModal(){
            this.setState({isSearchShow:false});
        },
        handleHideReportModal(){
            this.setState({isReportShow:false});
        },
        handleHideMatrixModal(){
            this.setState({isRMatrixShow:false});
        },
        showFullyDetail:function(detail){
            console.log(detail);
            // if( this.state.curr_detail === detail ){
            //     this.setState({isDetailShow:!this.state.isDetailShow})
            // }else{
            //     this.setState({isDetailShow:true, curr_detail:detail})
            // }
        },
        toggleCustomedURL:function(){
            this.setState({isCustomedURL:!this.state.isCustomedURL});
        },
        toggleEditting:function(){
            this.setState({isEditting:!this.state.isEditting});
        },
        updateChosenServer:function(server_id){
            this.setState({chosen_server:server_id});
        },
        toggle_report:function(){
            this.setState({isReportShow:!this.state.isReportShow});
        },
        updateResourceState:function(resource, callback){
            this.setState({resources:resource});
        },
        loadAppSample:function(){
            this.refs.codeeditor.loadAppTestSample()
        },
        loadServerSample:function(){
            this.refs.codeeditor.loadServerTestSample()
        },
        showRMatrixView:function(){
            this.setState({isRMatrixShow:!this.state.isRMatrixShow});
        },
        showServerView:function(){
            console.log('server view')
            this.setState({isServerBoxShow:true});
        },
        hideServerView:function(){
            this.setState({isServerBoxShow:false});
        },
        handleAddServer:function(){
            var server_url = this.state.url,
                access_token = this.state.access_token;
            var post_data = {
                url:server_url,
                token:access_token,
                name:'User server'
            }
            $.ajax({
                url:app.host+ '/home/addServer',
                type:'POST',
                data:JSON.stringify(post_data),
                dataType:'json',
                cache:false,
                success:function(res){
                    if( res.isSuccessful ){
                        app.showMsg("Server Added");
                    }else{
                        app.showMsg("Server can not be added");
                    }
                }
            })
        },
        updateServerList:function(){
            this.refs.serverlist.update();
        },
        render:function(){
            return (
                React.createElement("div", {className: "box"}, 
                    React.createElement(UserBtnArea, {history_action: this.showHistoryView, search_action: this.showSearchView, showMatrix: this.showRMatrixView}), 
                    React.createElement("div", {className: "test-input"}, 
                        React.createElement(ServerList, {ref: "serverlist", showServerView: this.showServerView, updateServer: this.updateChosenServer}), 
                        React.createElement("div", {className: "btnArea"}, 
                            React.createElement(SideMenuButton, {name_prefix: "Level", updateResource: this.updateResourceState, submitTestTask: this.handleTaskSubmit, btn_name: "Level Test", test_type: app.STANDARD_TEST, resource_url: "/home/resources?type=1"}), 
                            React.createElement(SideMenuButton, {name_prefix: "", updateResource: this.updateResourceState, submitTestTask: this.handleTaskSubmit, btn_name: "FHIR Test", test_type: app.FHIR_TEST, resource_url: "/home/resources?type=0"}), 
                            this.state.isReportReady ? React.createElement("button", {className: "btn btn-primary", onClick: this.toggle_report}, "Report") : null
                        ), 
                        
                        
                        React.createElement("div", {className: "btnArea"}, 
                            
                            React.createElement("label", null, 
                                React.createElement("input", {type: "checkbox", checked: this.state.isCustomedURL, onChange: this.toggleCustomedURL}), " Custom URL"
                            )
                        ), 
                        this.state.isCustomedURL ? React.createElement("div", null, React.createElement(UrlEditor, {updateUrl: this.updateUrl}), " ", React.createElement("button", {onClick: this.handleAddServer, className: "btn btn-primary"}, "Add")) : null, 
                        this.state.isLoading ? React.createElement("div", {className: "loading"}, React.createElement("img", {src: "../img/5.png", alt: "loading", class: "img-responsive loading-img"}))  : null, 
                        !this.state.isLoading && this.state.isResultReady ? React.createElement(ResultDisplay, {showFullyDetail: this.showFullyDetail, ref: "res_area"}) : null, 
                        this.state.isEditting ? React.createElement(CodeEditor, {submitTestTask: this.handleTaskSubmit, loadServerSample: this.loadServerSample, loadAppSample: this.loadAppSample, frame: document, updateCode: this.updateCode, ref: "codeeditor", language: "python"}) : null
                    ), 
                    React.createElement("div", {className: "result-area"}, 
                        React.createElement(FullyDetail, {ref: "full_detail"})
                    ), 
                    this.state.is_history_show ? React.createElement(Modal, {handleHideModal: this.handleHideModal, title: "History", content: React.createElement(HistoryViewer, null)}) : null, 
                    this.state.isSearchShow ? React.createElement(Modal, {handleHideModal: this.handleSearchHideModal, title: "Search Task", content: React.createElement(TaskSearchView, null)}) : null, 
                    this.state.isReportShow ? React.createElement(Modal, {handleHideModal: this.handleHideReportModal, title: "Test Report", content: React.createElement(ReportView, {report: this.state.test_report})}) : null, 
                    this.state.isRMatrixShow ? React.createElement(Modal, {handleHideMatrixModal: this.handleHideMatrixModal, title: "Test Matrix", content: React.createElement(MatrixArea, null)}) : null, 
                    this.state.isServerBoxShow ? React.createElement(Modal, {handleHideModal: this.hideServerView, title: "Manage Servers", content: React.createElement(ServerView, {update: this.updateServerList})}) : null
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