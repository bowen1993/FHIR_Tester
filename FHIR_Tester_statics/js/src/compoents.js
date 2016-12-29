
var app = app || {};


(function(){
    var SideMenuButton = app.SideMenuButton = React.createClass({
        getInitialState(){
            return {resources:[],curr_type:app.APP_TEST};
        },
        componentDidMount:function(){
            $.get(app.host+ '/home/resources', function (result) {
                if( result.isSuccessful ){
                    this.setState({resources:result.names});
                }
            }.bind(this));
        },
        onResourceChange:function(){
            var resource_state = []; 
            for ( var i = 0; i < this.state.resources.length; i++ ){
                var resource_name = this.state.resources[i].name
                resource_state.push({
                    name:resource_name,
                    checked:this.refs[resource_name].checked
                });
            }
            this.setState({resources:resource_state});
            // this.props.updateResource(resource_state);
        },
        handleClick:function(){
            this.props.submitTestTask(app.FHIR_TEST,this.state.resources);
        },
        render:function(){
            return (
                <div className="btn-group">
                    <button type="button" onClick={this.handleClick} className="btn btn-primary">FHIR Test</button>
                    <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                        Options <span className="caret"></span>
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <ul className="dropdown-menu customed-menu" role="menu">
                    {this.state.resources.map(function(resource){
                        return (
                        <li>
                            <label onClick={this.code}>
                                <input ref={resource.name} onChange={this.onResourceChange} type="checkbox" checked={resource.checked}/> {resource.name}
                            </label>
                        </li>
                        );
                    },this)}
                    </ul>
                </div>
            );
        }
    });
    var TestButton = app.TestButton = React.createClass({
        handleClick: function() {
            this.props.submitTestTask(this.props.btnType);
        },
        render: function() {
            return ( <button onClick = { this.handleClick }
                className = "btn btn-test"> <span className = "btn-test-text"> { this.props.btn_name } </span></button> );
        }
    });
    app.CodeEditor = React.createClass({
        getInitialState:function(){
            return {isDragging:true}
        },
        handleType:function(){
            this.props.updateCode(this.editor.session.getValue());
        },
        stopFrameListeners: function(frame) {
            frame = frame || this.props.frame;
            frame.removeEventListener("dragenter", this._handleFrameDrag);
            frame.removeEventListener("dragleave", this._handleFrameDrag);
            frame.removeEventListener("drop", this._handleFrameDrop);
        },
        startFrameListeners: function(frame) {
            frame = frame || this.props.frame;
            frame.addEventListener("dragenter", this._handleFrameDrag);
            frame.addEventListener("dragleave", this._handleFrameDrag);
            frame.addEventListener("drop", this._handleFrameDrop);
        },
        _handleWindowDragOverOrDrop: function(event) {
            event.preventDefault();
        },
        _handleFrameDrag: function (event) {
            // We are listening for events on the 'frame', so every time the user drags over any element in the frame's tree,
            // the event bubbles up to the frame. By keeping count of how many "dragenters" we get, we can tell if they are still
            // "draggingOverFrame" (b/c you get one "dragenter" initially, and one "dragenter"/one "dragleave" for every bubble)
            
        },

        _handleFrameDrop: function(event) {
           
        },
        componentWillMount: function() {
            this.startFrameListeners();
            window.addEventListener("dragover", this._handleWindowDragOverOrDrop);
            window.addEventListener("drop", this._handleWindowDragOverOrDrop);
        },
        componentDidMount:function(){
            this.editor = ace.edit("codeeditor");
            this.editor.setTheme("ace/theme/clouds");
            this.editor.setOptions({
                fontSize: "1.2em"
            });
            this.editor.session.setMode("ace/mode/"+this.props.language);
            this.setState({curr_type:app.APP_TEST});
            this.loadAppTestSample();
        },
        loadAppTestSample:function(){
            this.editor.setValue(app.app_sample,1);
            this.props.updateCode(this.editor.session.getValue());
        },
        loadServerTestSample:function(){
            this.editor.setValue(app.server_sample, 1);
            this.props.updateCode(this.editor.session.getValue());
        },
        componentWillUnmount: function() {
            this.stopFrameListeners();
            window.removeEventListener("dragover", this._handleWindowDragOverOrDrop);
            window.removeEventListener("drop", this._handleWindowDragOverOrDrop);
        },
        loadAppCode:function(){
            $('#tab-app').tab('show');
            this.setState({curr_type:app.APP_TEST});
            this.props.loadAppSample();
        },
        loadServerCode:function(){
            $('#tab-server').tab('show');
            this.setState({curr_type:app.SERVER_TEST});
            this.props.loadServerSample();
        },
        performTestCode:function(){
            this.props.submitTestTask(this.state.curr_type);
        },
        handleDrop:function(event){
            event.preventDefault();
            var files = (event.dataTransfer) ? event.dataTransfer.files : (event.frame) ? event.frame.files : undefined;
            console.log(files);
        },
        render:function(){
            return (
                <div className="editorWrap">
                <ul className="nav nav-tabs mode-tab" role="tablist">
                    <li role="presentation" id="tab-app" onClick={this.loadAppCode} className="active"><a href="#">App Test</a></li>
                    <li role="presentation" id="tab-server" onClick={this.loadServerCode}><a href="#">Server Test</a></li>
                    <button onClick={this.performTestCode} className="btn btn-run pull-right"><span className="glyphicon glyphicon-play"></span> Run</button>
                </ul>
                <div id="codeeditor" onDrop={this.handleDrop} onKeyUp={this.handleType} >
                </div>
                </div>
            );
        }
    });
    app.TokenEditor = React.createClass({
        handleChange:function(){
            var new_token = this.refs.tokenInput.value;
            this.props.updateToken(new_token);
        },
        render: function(){
            return (
                <input className="input-url" onChange={this.handleChange} ref="tokenInput" placeholder="Input Server Access Token" />
            );
        }
    });
    app.UrlEditor = React.createClass({
        getInitialState: function(){
            return {
                url_vaild:true
            }
        },
        handleChange:function(){
            //if url valid, update state, if not, warn
            var url_str = this.refs.urlInput.value;
            if (app.isUrl(url_str)){
                this.setState({url_vaild:true});
                //this.probs.updateUrl(url_str)
            }else{
                this.setState({url_vaild:false});
            }
            this.props.updateUrl(url_str);
        },
        classNames:function(){
            return 'input-url ' + ((this.state.url_vaild) ? 'input-right':'input-error');
        },
        render: function(){
            return (
                <input className={this.classNames()} onChange={this.handleChange} ref="urlInput" placeholder="Type Server or App URL"/>
            );
        }
    });
    var ServerList = app.ServerList = React.createClass({
        getInitialState:function(){
            return {chosedServer:-1, currentDisplay:"Servers",servers:[]};
        },
        componentDidMount:function(){
            //get server list
            this.serverRequest = $.get(app.host+ '/home/servers', function (result) {
                if( result.isSuccessful ){
                    this.setState({servers:result.servers});
                }
            }.bind(this));
        },
         componentWillUnmount: function() {
            this.serverRequest.abort();
        },
        onServerClick:function(event){
            this.props.updateServer(event.currentTarget.dataset.serverid);
            this.setState({currentDisplay:event.currentTarget.dataset.servername});
        },
        render:function(){
            return (
                    <div className="dropdown server-list">
                        <button ref="menu_display" className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
                            {this.state.currentDisplay}
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                            {this.state.servers.map(function(server){
                                return <li role="presentation"><a data-serverName={server.name} data-serverid={server.id} onClick={this.onServerClick} role="menuitem" tabindex="-1" href="#">{server.name}</a></li>
                            }.bind(this))}
                        </ul>
                    </div>
            );
        }
    })
    var ResultDisplay = app.ResultDisplay = React.createClass({
        getInitialState:function(){
            return {'level':[],test_type:null,  test_type_str:'', 'steps':[]}
        },
        emptyCurrentDisplay:function(){
            this.setState({steps:[]});
        },
        displayResult:function(res_dict){
            console.log(res_dict);
            var test_type = res_dict.test_type
            this.setState({test_type:test_type});
            var test_type_str = ''
            if( test_type == 0 ){
                test_type_str = 'Genomics Standard Test'
            }else if( test_type == 1 ){
                test_type_str = 'Application Test'
            }else{
                test_type_str = 'Custom Server Test'
            }
            this.setState({'test_type_str':test_type_str})
            if (test_type == 0){
                this.setState({'level':res_dict.level});
            }
            this.setState({'steps':res_dict['steps']});
        },
        render: function(){
            return (
                <div className="result-container">
                    <div className="result-head"><span className="area-title area-title-black">Test Type: {this.state.test_type_str}</span> <span></span></div>
                    <div className="detail-result">
                        <div className="result-sum">
                            {this.state.test_type == 0 ? <h3>Level: {this.state.level.map(function(l){
                                return <span>{l}, </span>
                            })}</h3> : null}
                        </div>
                        {this.state.steps.map(function(step){
                            return <StepDisplay showFullyDetail={this.props.showFullyDetail} stepInfo={step} />
                        },this)}
                    </div>
                </div>
            )
        }
    });

    var HTTPDetail = app.HTTPDetail = React.createClass({
        render:function(){
            return(
                <div className="http-area detail-result">
                    
                    {this.props.detail.req_header != null ? 
                        <div className="http-content">
                        <h4>HTTP Request Header</h4> 
                        <pre>{JSON.stringify(JSON.parse(this.props.detail.req_header), null, 2) }</pre> </div>:
                        null
                    }    
                    
                    
                    {this.props.detail.res_header != null ? 
                        <div className="http-content">
                        <h4>HTTP Response Header</h4>
                        <pre>{JSON.stringify(JSON.parse(this.props.detail.res_header), null, 2) }</pre></div> :
                        null
                    }
                    {this.props.detail.response_message != null ?
                        <div className="http-content">
                        <h4>Response Message</h4>
                        <pre>{JSON.stringify(JSON.parse(this.props.detail.response_message), null, 2) }</pre> </div>: 
                        null
                    }

                    {this.props.detail.req_resource != null ?
                        <div className="http-content">
                        <h4>Test Resource</h4>
                        <pre>{JSON.stringify(JSON.parse(this.props.detail.req_resource), null, 2) }</pre></div> :
                        null
                    }

                </div>
            );
        }
    });

    var FullyDetail = app.FullyDetail = React.createClass({
        getInitialState:function(){
            return {detail_infos:[],is_image:false,is_modal_show:false,curr_img_src:''}
        },
        updateDetail:function(new_details){
            this.setState({detail_infos:new_details});
            if( new_details.length>0 && new_details[0].addi && new_details[0].addi.length!=0 ){
                this.setState({is_image:true})
            }
        },
        handleHideModal(){
            this.setState({is_modal_show:false});
        },
        handleShowModal(){
            this.setState({is_modal_show: true});
        },
        handleShowFullImage:function(event,img_src){
            event.stopPropagation();
            this.setState({is_modal_show:true,curr_img_src:img_src});
        },
        render:function(){
            return (
                <div className="result-container">
                {this.state.is_image ? this.state.detail_infos.map(function(step){
                    return <div id={step.index}>
                        <h3>{step.name}</h3>
                        {step.status ? <span className="success-bar">Success</span> : <span className="fail-bar">Fail</span>}
                        <img onClick={() =>this.handleShowFullImage(event,step.addi)} className="img-responsive img-rounded step-img" src={app.host + step.addi} />
                    </div>
                },this) :this.state.detail_infos.map(function(step){
                    return step.details.map(function(detail){
                        return <div id={step.index + "_" + detail.index}>
                                <h3>{step.name + " " + detail.resource_name}</h3>
                                <div className="result-head"><span className="area-title area-title-black">Test case detail </span>
                                {detail.status==2 ? <span className="success-bar">Success</span> : detail.status==1? <span className="warning-bar">Warning</span> : <span className="fail-bar">Fall</span>} 
                                </div>
                                <div className="detail-desc-block">
                                        {detail.desc}
                                </div>
                                <HTTPDetail detail={detail}/>
                            </div>
                    },this)
                },this)}
                {this.state.is_modal_show && this.state.is_image ? <Modal handleHideModal={this.handleHideModal} title="Step Image" content={<FullImageArea img_src={app.host + this.state.curr_img_src} />} /> : null}
                </div>
            );
        }
    });

    var StepDisplay = app.StepDisplay = React.createClass({
        getInitialState: function(){
            return {
                is_img_hide:true,
                is_modal_show:false,
                is_has_image:false,
                is_detail_showing:false,
                detail_desc:''
            }
        },
        showDetail:function(detail){
            if(this.state.detail_desc === detail.desc){
                this.setState({is_detail_showing:!this.state.is_detail_showing});
            }else{
                this.setState({detail_desc:detail.desc, is_detail_showing:true});
            }
            this.props.showFullyDetail(detail) 
        },
        componentDidMount:function(){
            if(this.props.stepInfo.addi){
                this.setState({is_has_image:true});
            }
        },
        handleTextClick:function(){
            if (this.state.is_has_image){
                this.setState({is_img_hide:!this.state.is_img_hide});
            }
        },
        componentWillReceiveProps:function(nextProps){
            if (nextProps.stepInfo.addi && nextProps.stepInfo.addi.length != 0){
                this.setState({is_has_image:true})
            }
        },
        handleShowFullImage:function(event){
            event.stopPropagation();
            this.setState({is_modal_show:true});
        },
        handleHideModal(){
            this.setState({is_modal_show:false});
        },
        handleShowModal(){
            this.setState({is_modal_show: true});
        },
        render:function(){
            return (
                <div className="step-brief step-brief-success" onClick={this.handleTextClick}>
                    <div><span  className="step-brief-text">{this.props.stepInfo.desc}</span></div>
                    <div className="step-detail-area">
                        <div className="detail-hint-block">
                            {this.props.stepInfo.details.map(function(detail){
                                return <StepDetail sindex={this.props.stepInfo.index} fully_detail={detail} status={detail.status} desc={detail.desc} showDetail={this.showDetail} />
                            }, this)}
                        </div>
                        {this.state.is_detail_showing ? <div className="detail-desc-block">
                            {this.state.detail_desc}
                        </div> : null}
                        
                    </div>
                    <div hidden={this.state.is_img_hide && !this.state.is_has_image} className="step-img-block">
                        
                       <a href={"#"+this.props.stepInfo.index}> <img className="img-responsive img-thumbnail step-img-small" src={app.host + this.props.stepInfo.addi} /> </a>
                    </div>
                    {this.state.is_modal_show && this.state.is_has_image ? <Modal handleHideModal={this.handleHideModal} title="Step Image" content={<FullImageArea img_src={app.host + this.props.stepInfo.addi} />} /> : null}
                </div>
            );
        }
    });
    var StepDetail = app.StepDetail = React.createClass({
        getInitialState:function(){
            return {btnStatus:"success"}
        },
        classes:function(){
            return 'btn' + this.props.status ? ' btn-success': ' btn-danger' + ' btn-circle';
        },
        componentWillReceiveProps:function(nextProps){
            if ( nextProps.status == 0 ) {
                this.setState({btnStatus:"danger"})
            }else if ( nextProps.status == 1 ) {
                this.setState({btnStatus:"warning"})
            }else if ( nextProps.status == 2 ) {
                this.setState({btnStatus:"success"})
            }
        },
        onBtnClick:function(){
            this.props.showDetail(this.props.fully_detail);
        },
        render:function(){
            return (
                <a href={"#"+this.props.sindex+"_"+this.props.fully_detail.index} onClick={this.onBtnClick} className={'btn btn-circle btn-'+this.state.btnStatus}>{ this.props.status==2 ? 'P' : this.props.status==1 ? 'W' : 'F'}</a>
            )
        }
    })
    app.UserBtnArea = React.createClass({
        handleLogout:function(){
            $.removeCookie('fhir_token', { path: '/' });
            window.location.href = '/'
        },
        render:function(){
            return (
                <div className="user-op">
                    <button className="btn btn-user" onClick={this.props.showMatrix}>FHIR Matrix</button>
                    <button className="btn btn-user" onClick={this.props.history_action}>History</button>
                    <button className="btn btn-user" onClick={this.props.search_action}>Search Task</button>

                    <button className="btn btn-user" onClick={this.handleLogout}><span className="glyphicon glyphicon-off"></span></button>
                </div>
            );
        }
    });
    var FullImageArea = app.FullImageArea = React.createClass({
        render:function(){
            return(
                <img src={this.props.img_src} className="img-responsive" />
            );
        }
    });
    var TaskItem = app.TaskItem = React.createClass({
        handleClick:function(){
            this.props.itemClicked(this.props.task_id);
        },
        render:function(){
            return (
                <div className="list-item" onClick={this.handleClick}>
                    <span>Task ID: </span>{this.props.task_id}
                    <span className="pull-right"> Time: {this.props.task_time}</span>
                </div>
            );
        }
    });
    var TaskList = app.TaskList = React.createClass({
        render:function(){
            return (
                <div className="task-list">
                    
                    <div className="list-content">
                        {this.props.tasks.map(function(task_info){
                            return <TaskItem itemClicked={this.props.fetchTaskDetail} task_id={task_info.task_id} task_time={task_info.time} />
                        },this)}
                    </div>
                </div>
                );
        }
    });
    var TaskSearchView = app.TaskSearchView = React.createClass({
        getInitialState:function(){
            return {keywords:'', tasks:[]}
        },
        updateTestResult:function(res){
            this.refs.res_area.displayResult(res);
        },
        componentDidMount:function(){
            window.searchView = this;
        },
        onUserInput:function(){
            var self = this;
            var postData = {
                'keyword':this.refs.keywordField.value
            }
            $.ajax({
                url:app.host+ '/home/search',
                type:'POST',
                data:JSON.stringify(postData),
                dataType:'json',
                cache:false,
                success:function(data){
                    if( data.isSuccessful ){
                        self.setState({tasks:data.tasks});
                    }
                }
            });
        },
        getTaskDetail:function(task_id){
            this.refs.res_area.emptyCurrentDisplay();
            console.log(task_id);
            app.setup_websocket(task_id,3)
        },
        render:function(){
            return (
                <div className="task-search-area">
                    <input className="input-url" placeholder="Search Tasks..." ref="keywordField" onChange={this.onUserInput} />
                    <div className="history-area">
                    <TaskList fetchTaskDetail={this.getTaskDetail} tasks={this.state.tasks}/>
                    <ResultDisplay ref="res_area"/>
                    </div>
                </div>
            )
        }
    });
    app.MatrixArea = React.createClass({
        getInitialState:function(){
            return {'type':app.FHIR_TEST,'curr_title':'FHIR Genomics','time':'', time_list:[]};
        },
        componentWillMount:function(){
            $.ajax({
                type:"POST",
                url:app.host+'/home/times',
                data:JSON.stringify({'ttype':this.state.type}),
                dataType:'json',
                success:function(result){
                    this.setState({time_list:result['times']});
                    $('[data-toggle="tooltip"]').tooltip();
                }.bind(this)
            })
        },
        updateTimeline:function(ttype){
            $.ajax({
                type:"POST",
                url:app.host+'/home/times',
                data:JSON.stringify({'ttype':ttype}),
                dataType:'json',
                success:function(result){
                    this.setState({time_list:result['times']});
                    $('[data-toggle="tooltip"]').tooltip();
                }.bind(this)
            })
        },
        componentDidMount:function(){
            $.get(app.host+ '/home/rmatrix', function (result) {
                app.drawMatrix(result);
            }.bind(this));
            $('[data-toggle="tooltip"]').tooltip();
        },
        transTypeTitle:function(ttype){
            if( ttype == app.FHIR_TEST){
                return 'FHIR Genomics';
            }else if( ttype == app.SERVER_TEST ){
                return 'Custom Server Test';
            }else if( ttype == app.STANDARD_TEST ){
                return 'Server Level';
            }else{
                return "";
            }
        },
        retriveNewMatrix:function(ttype, ttime){
            $.ajax({
                type:'POST',
                dataType:'json',
                data:JSON.stringify({ttype:ttype, time:ttime}),
                url:app.host + '/home/matrix',
                success:function(res){
                    app.drawMatrix(res.matrix);
                }.bind(this)
            })
        },
        updateTType:function(event){
            var ttype = event.currentTarget.dataset.ttype;
            var ttype_title = this.transTypeTitle(ttype);
            this.setState({'type':ttype, curr_title:ttype_title});
            this.retriveNewMatrix(ttype, this.state.time);
            this.updateTimeline(ttype);
        },
        updateTTime:function(event){
            var ttime = event.currentTarget.dataset.ttime;
            this.setState({'time':ttime})
            this.retriveNewMatrix(this.state.type, ttime);
        },
        render:function(){
            return (
                <div className="matrix-area">
                <div className="title"><h4>{this.state.curr_title}</h4></div>
                    <div className="btn-area">
                        <button onClick={this.updateTType} className="btn btn-primary btn-matrix" data-ttype={app.FHIR_TEST}>FHIR Genomics</button>
                        <button onClick={this.updateTType} className="btn btn-primary btn-matrix" data-ttype={app.STANDARD_TEST}>Level Test</button>
                        <button onClick={this.updateTType} className="btn btn-primary btn-matrix" data-ttype={app.SERVER_TEST}>Server Test</button>
                    </div>
                    <div className="timeline">
                    {this.state.time_list.map(function(t){
                        return <div onClick={this.updateTTime} className="timedot" data-toggle="tooltip" data-ttime={t} data-placement="bottom" title={t}></div>
                    },this)}
                    </div>
                    <div id="matrix"></div>
                </div>
                )
        }
    });
    var HistoryViewer = app.HistoryViewer = React.createClass({
        getInitialState:function(){
            return {tasks:[]};
        },
        updateTestResult:function(res){
            this.refs.res_area.displayResult(res);
        },
        componentDidMount:function(){
            window.hist = this;
            var postData = {
                token:$.cookie('fhir_token')
            };
            var self = this;
            console.log(postData);
            $.ajax({
                url:app.host+ '/home/history',
                type:'POST',
                data:JSON.stringify(postData),
                dataType:'json',
                cache:false,
                success:function(data){
                    if( data.isSuccessful ){
                        self.setState({tasks:data.tasks});
                    }
                }
            });
        },
        getTaskDetail:function(task_id){
            this.refs.res_area.emptyCurrentDisplay();
            console.log(task_id);
            app.setup_websocket(task_id,2)
        },
        render:function(){
            return (
                <div className="history-area">
                    <TaskList fetchTaskDetail={this.getTaskDetail} tasks={this.state.tasks}/>
                    <ResultDisplay ref="res_area"/>
                </div>
            );
        }
    });
    var ReportView = app.ReportView = React.createClass({
        getCellStatus:function(status){
                if( status ){
                    return 'success'
                }else{
                    return 'danger'
                }
        },
        render:function(){
            return(
                <div className="report-area">
                    <div className="brief-info">
                        <h4>Test Type: {this.props.report.test_type}</h4>
                        <h4>Target Server: {this.props.report.server}</h4>
                        <h4>Level: {this.props.report.level == null? null : this.props.report.level.map(function(l){
                            return <span>{l}, </span>
                        })}</h4>
                    </div>
                    <div className="table-info">
                    <h3>Details</h3>
                        <table className="table table-bordered">
                        <tbody>
                        {this.props.report.infos.map(function(info){
                            return (
                                <tr>
                                    <td>{info.name}</td>
                                    {info.detail_infos.map(function(detail){
                                        return <td className={this.getCellStatus(detail.status)}>{detail.resource}</td>
                                    },this)}
                                    <td className={this.getCellStatus(info.status)}> {info.name} {info.status ? 'Passed' : 'Failed'}</td>
                                </tr>
                            );
                        },this)}
                        </tbody>
                        </table>
                    </div>
                </div>
            )
        }
    });
    var Modal = app.Modal = React.createClass({
        componentDidMount(){
            $(ReactDOM.findDOMNode(this)).modal('show');
            $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);
        },
        render:function(){
            return (
                <div className="modal modal-wide fade">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">{this.props.title}</h4>
                            </div>
                            <div className="modal-body">
                                {this.props.content}
                            </div>
                            <div className="modal-footer text-center">
                                <button className="btn btn-primary center-block" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    });
})();

