var app = app || {};

(function(){
    app.TestButton = React.createClass({
        handleClick: function() {
            this.props.submitTestTask(this.props.btnType);
        },
        render: function() {
            return ( <button onClick = { this.handleClick }
                className = "btn btn-test"> <span className = "btn-test-text"> { this.props.btn_name } </span></button> );
        }
    });
    app.CodeEditor = React.createClass({
        handleType:function(){
            this.props.updateCode(this.editor.session.getValue());
        },
        componentDidMount:function(){
            this.editor = ace.edit("codeeditor");
            this.editor.setTheme("ace/theme/clouds");
            this.editor.setOptions({
                fontSize: "1.2em"
            });
            this.editor.session.setMode("ace/mode/"+this.props.language);
        },
        render:function(){
            return (
                <div id="codeeditor" onKeyUp={this.handleType}></div>
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
            this.serverRequest = $.get('http://localhost:8000/home/servers', function (result) {
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
            return {'level':-1, test_type:0, 'steps':[]}
        },
        emptyCurrentDisplay:function(){
            this.setState({steps:[]});
        },
        displayResult:function(res_dict){
            console.log(res_dict);
            var test_type = res_dict.test_type
            this.setState({'test_type':test_type})
            if (test_type == 0){
                this.setState({'level':res_dict.level});
            }
            this.setState({'steps':res_dict['steps']});
        },
        render: function(){
            return (
                <div className="result-container">
                    <div className="result-head"><span className="area-title area-title-black">Test Type: </span> <span>{this.props.testType}</span></div>
                    <div className="detail-result">
                        <div className="result-sum">
                            {this.state.test_type == 0 ? <h3>Level: {this.state.level}</h3> : null}
                        </div>
                        {this.state.steps.map(function(step){
                            return <StepDisplay stepInfo={step} />
                        })}
                    </div>
                </div>
            )
        }
    });


    var StepDisplay = app.StepDisplay = React.createClass({
        getInitialState: function(){
            return {
                is_img_hide:true,
                is_modal_show:false,
                is_has_image:false
            }
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
                    <div hidden={this.state.is_img_hide && !this.state.is_has_image} className="step-img-block">
                        <button onClick={this.handleShowFullImage} className="btn btn-primary">Full Image</button>
                        <img className="img-responsive img-rounded step-img" src={this.props.stepInfo.addi} />
                    </div>
                    {this.state.is_modal_show && this.state.is_has_image ? <Modal handleHideModal={this.handleHideModal} title="Step Image" content={<FullImageArea img_src={this.props.stepInfo.addi} />} /> : null}
                </div>
            );
        }
    });
    app.UserBtnArea = React.createClass({
        handleLogout:function(){
            app.showMsg("Logout");
        },
        render:function(){
            return (
                <div className="user-op">
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
                    <span>Task ID:</span>{this.props.task_id}
                </div>
            );
        }
    });
    var TaskList = app.TaskList = React.createClass({
        render:function(){
            return (
                <div className="task-list">
                    
                    <div className="list-content">
                        {this.props.tasks.map(function(task_id){
                            return <TaskItem itemClicked={this.props.fetchTaskDetail} task_id={task_id} />
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
        onUserInput:function(){
            this.setState({keywords:this.refs.keywordField})
        },
        render:function(){
            return (
                <div className="task-search-area">
                    <input className="input-url" placeholder="Search Tasks..." refs="keywordField" onChange={this.onUserInput} />
                    <button className="btn btn-success"><span className="glyphicon glyphicon-search"></span></button>
                    <div className="history-area">
                    <TaskList fetchTaskDetail={this.getTaskDetail} tasks={this.state.tasks}/>
                    <ResultDisplay ref="res_area"/>
                    </div>
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
                url:'http://localhost:8000/home/history',
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

