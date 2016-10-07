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
            return {resources:[],isReportReady:false,test_report:{},code:"",url:"", test_type:'', isResultReady:true, isLoading:false, isTestPass:true, isTestFail:false,chosen_server:-1, access_token:null, is_history_show:false, isEditting:false, isCustomedURL:false, isSearchShow:false, isDetailShow:false, isReportShow:false};
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
        handleTaskSubmit:function(submitType){
            //this.state.isLoading = !this.state.isLoading;
            //this.setState({isLoading:!this.state.isLoading});

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
            $.get(app.host+ '/home/resources', function (result) {
                if( result.isSuccessful ){
                    console.log(result.names)
                    this.setState({resources:result.names});
                }
            }.bind(this));
        },
        updateTestResult:function(res){
            this.setState({isResultReady:true, isLoading:false});
            this.refs.res_area.displayResult(res);
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
        showFullyDetail:function(detail){
            if( this.state.curr_detail === detail ){
                this.setState({isDetailShow:!this.state.isDetailShow})
            }else{
                this.setState({isDetailShow:true, curr_detail:detail})
            }
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
        render:function(){
            return (
                <div className="box">
                    <UserBtnArea history_action={this.showHistoryView} search_action={this.showSearchView}/>
                    <div className="test-input">
                        <ServerList updateServer={this.updateChosenServer}/>
                        <div className="btnArea">
                            <TestButton btn_name="App Test" submitTestTask={this.handleTaskSubmit} btnType={app.APP_TEST}/>
                            <TestButton btn_name="Server Test" submitTestTask={this.handleTaskSubmit} btnType={app.SERVER_TEST}/>
                            <TestButton btn_name="Level Test" submitTestTask={this.handleTaskSubmit} btnType={app.STANDARD_TEST}/>
                            <SideMenuButton resources={this.state.resources}/>
                            {this.state.isReportReady ? <button className="btn btn-primary" onClick={this.toggle_report}>Report</button> : null }
                        </div>
                        <div className="btnArea">
                            <label>
                                <input type="checkbox" checked={this.state.isEditting} onChange={this.toggleEditting}/> Code Editor
                            </label>
                            <label>
                                <input type="checkbox" checked={this.state.isCustomedURL} onChange={this.toggleCustomedURL}/> Custom URL
                            </label>
                        </div>
                        {this.state.isCustomedURL ? <div><UrlEditor updateUrl={this.updateUrl}/><TokenEditor updateToken={this.updateAccessToken} /></div> : null}
                        {this.state.isLoading ? <div className="loading"><img src="../img/5.png" alt="loading" class="img-responsive loading-img" /></div>  : null}
                        {!this.state.isLoading && this.state.isResultReady ? <ResultDisplay showFullyDetail={this.showFullyDetail} ref="res_area"/> : null }
                        {this.state.isEditting ? <CodeEditor updateCode={this.updateCode} language="python"/> : null}
                    </div>
                    <div className="result-area">
                        { this.state.isDetailShow ? <FullyDetail detail={this.state.curr_detail}/> : null }
                    </div>
                    {this.state.is_history_show ? <Modal handleHideModal={this.handleHideModal} title="History" content={<HistoryViewer />} /> : null}
                    {this.state.isSearchShow ? <Modal handleHideModal={this.handleSearchHideModal} title="Search Task" content={<TaskSearchView />} /> : null}
                    {this.state.isReportShow ? <Modal handleHideModal={this.handleHideReportModal} title="Test Report" content={<ReportView report={this.state.test_report}/>} /> : null}
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