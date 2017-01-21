var app = app || {};


(function(){
    var SideMenuButton = app.SideMenuButton = React.createClass({displayName: "SideMenuButton",
        getInitialState(){
            return {resources:[],curr_type:app.APP_TEST,name:""};
        },
        componentDidMount:function(){
            $.get(app.host+ this.props.resource_url, function (result) {
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
        },
        handleClick:function(){
            this.props.submitTestTask(this.props.test_type,this.state.resources);
        },
        cpCode:function(){
        	console.log("copy options", this);
        },
        render:function(){
            return (React.createElement("div", {className: "btn-group"}, 
                    React.createElement("button", {type: "button", onClick: this.handleClick, className: "btn btn-primary"}, this.props.btn_name), 
                    React.createElement("button", {type: "button", className: "btn btn-primary dropdown-toggle", "data-toggle": "dropdown"}, 
                        "Options ", React.createElement("span", {className: "caret"}), 
                        React.createElement("span", {className: "sr-only"}, "Toggle Dropdown")
                    ), 
                    React.createElement("ul", {className: "dropdown-menu customed-menu", role: "menu"}, 
                    this.state.resources.map(function(resource){
                        return (
                        React.createElement("li", null, 
                            React.createElement("label", {onClick: this.code}, 
                                React.createElement("input", {ref: resource.name, onChange: this.onResourceChange, type: "checkbox", checked: resource.checked}), 
                                 React.createElement("span", null, " ", this.props.name_prefix + ' ' + resource.name)
                            )
                            
                        )
                        );
                    },this)
                    )
                ))
        }
    });
    var TestButton = app.TestButton = React.createClass({displayName: "TestButton",
        handleClick: function() {
            this.props.submitTestTask(this.props.btnType);
        },
        render: function() {
            return ( React.createElement("button", {onClick:  this.handleClick, 
                className: "btn btn-test"}, " ", React.createElement("span", {className: "btn-test-text"}, " ",  this.props.btn_name, " ")) );
        }
    });
    app.CodeEditor = React.createClass({displayName: "CodeEditor",
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
                React.createElement("div", {className: "editorWrap"}, 
                React.createElement("ul", {className: "nav nav-tabs mode-tab", role: "tablist"}, 
                    React.createElement("li", {role: "presentation", id: "tab-app", onClick: this.loadAppCode, className: "active"}, React.createElement("a", {href: "#"}, "App Test")), 
                    React.createElement("li", {role: "presentation", id: "tab-server", onClick: this.loadServerCode}, React.createElement("a", {href: "#"}, "Server Test")), 
                    React.createElement("button", {onClick: this.performTestCode, className: "btn btn-run pull-right"}, React.createElement("span", {className: "glyphicon glyphicon-play"}), " Run")
                ), 
                React.createElement("div", {id: "codeeditor", onDrop: this.handleDrop, onKeyUp: this.handleType}
                )
                )
            );
        }
    });
    app.TokenEditor = React.createClass({displayName: "TokenEditor",
        handleChange:function(){
            var new_token = this.refs.tokenInput.value;
            this.props.updateToken(new_token);
        },
        render: function(){
            return (
                React.createElement("input", {className: "input-url", onChange: this.handleChange, ref: "tokenInput", placeholder: "Input Server Access Token"})
            );
        }
    });
    var UrlEditor = app.UrlEditor = React.createClass({displayName: "UrlEditor",
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
            return 'input-url ' + ((this.state.url_vaild) ? 'input-right ':'input-error ') + (this.props.customedClass!=null ? this.props.customedClass : '');
        },
        render: function(){
            return (
                React.createElement("input", {className: this.classNames(), onChange: this.handleChange, ref: "urlInput", placeholder: "Server URL"})
            );
        }
    });
    var ServerList = app.ServerList = React.createClass({displayName: "ServerList",
        getInitialState:function(){
            return {chosedServer:-1, currentDisplay:"Servers",servers:[], strlist:""};
        },
        componentDidMount:function(){
            //get server list
            this.serverRequest = $.get(app.host+ '/home/servers', function (result) {
                if( result.isSuccessful ){
                    this.setState({servers:result.servers});
                }
            }.bind(this));
        },
        update:function(){
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
        onEditClick:function(){
            this.props.showServerView();
        },
        handleChange:function(event){
            this.setState({serv:event.target.value});
        },
        getServer:function(event){
            this.handleChange(event);
            for (var i = 0; i < this.state.servers.length; i++) {
                if(this.state.serv == this.state.servers[i].name){
                    this.setState({currentDisplay:this.state.serv});
                }else{
                    console.log("please input true server name");
                }
            }
        },        
        handleKey:function(event){
            if (event.keyCode === 13) {
                this.setState({serv:event.target.value});
                for (var i = 0; i < this.state.servers.length; i++) {
                    if(this.state.serv == this.state.servers[i].name){
                        this.setState({currentDisplay:this.state.serv});
                        this.props.updateServer(this.state.servers[i].id);
                    }else{
                        console.log("please input true server name");
                    }
                }
            }            
        },
        render:function(){
            return (
            	React.createElement("div", {className: "input-group"}, 
                    React.createElement("div", {className: "dropdown server-list input-group-btn"}, 
                        React.createElement("button", {ref: "menu_display", className: "btn btn-default dropdown-toggle", type: "button", id: "dropdownMenu1", "data-toggle": "dropdown"}, this.state.currentDisplay, React.createElement("span", {className: "caret"})), 
                        React.createElement("ul", {className: "dropdown-menu", role: "menu", "aria-labelledby": "dropdownMenu1"}, 
                            this.state.servers.map(function(server){
                                return React.createElement("li", {role: "presentation"}, React.createElement("a", {"data-serverName": server.name, "data-serverid": server.id, onClick: this.onServerClick, role: "menuitem", tabindex: "-1", href: "#"}, server.name))
                            }.bind(this)), 
                            React.createElement("li", {className: "divider"}), 
                            React.createElement("li", {role: "presentation"}, React.createElement("a", {role: "menuitem", onClick: this.onEditClick, href: "#"}, " Manage Servers"))
                        )
                    ), 
                    React.createElement("input", {className: "form-control awesomplete", onChange: this.handleChange, onFocus: this.getServer, onBlur: this.getServer, onKeyUp: this.handleKey, id: "serverlist", placeholder: 'server name'})
                )
            );
        }
    });
    var ServerView = app.ServerView = React.createClass({displayName: "ServerView",
        getInitialState:function(){
            return {servers:[], strlist:"", newUrl:"",curr_server:null};
        },
        componentDidMount:function(){
            //get server list
            this.serverRequest = $.get(app.host+ '/home/servers', function (result) {
                if( result.isSuccessful ){
                    result.servers.forEach(function(server,i){
                        server.is_active=false;
                        server.i = i;
                    });
                    this.setState({servers:result.servers});
                }
            }.bind(this));
        },
        updateServers:function(){
            this.serverRequest = $.get(app.host+ '/home/servers', function (result) {
                if( result.isSuccessful ){
                    result.servers.forEach(function(server,i){
                        server.is_active=false;
                        server.i = i;
                    });
                    this.setState({servers:result.servers});
                    this.setState({curr_server:null});
                }
            }.bind(this));
            this.props.update();
        },
        addServer:function(){
            if(app.isUrl(this.state.newUrl) && this.refs.servername.value.length!=0){
                var post_data = {
                    url:this.state.newUrl,
                    name:this.refs.servername.value
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
                            this.updateServers();
                        }else{
                            app.showMsg("Server can not be added");
                        }
                    }.bind(this)
                })
            }else{
                app.showMsg("Please input valid info");
            }
        },
        updateUrl:function(new_url){
            this.setState({newUrl:new_url})
        },
        componentWillUnmount: function() {
            this.serverRequest.abort();
        },
        showServerDetail:function(server){
            this.setState({curr_server:server})
        },
        delete_server:function(server_id){
            var post_data = {
                id:server_id
            }
            $.ajax({
                    url:app.host+ '/home/deleteServer',
                    type:'POST',
                    data:JSON.stringify(post_data),
                    dataType:'json',
                    cache:false,
                    success:function(res){
                        if( res.isSuccessful ){
                            app.showMsg("Server Deleted");
                            this.updateServers();
                        }else{
                            app.showMsg("Server can not be deleted");
                        }
                    }.bind(this)
                });
        },
        render:function(){
            return (
                React.createElement("div", {className: "server-manage-view"}, 
                    React.createElement("div", {className: "url-box"}, 
                        React.createElement("input", {className: "input-url url-side", ref: "servername", placeholder: "Server Name"}), 
                        React.createElement(UrlEditor, {updateUrl: this.updateUrl, customedClass: "url-main"}), 
                        React.createElement("button", {onClick: this.addServer, className: "btn btn-primary"}, "Add")
                    ), 
                    React.createElement("div", {className: "servers"}, 
                        React.createElement("ul", {class: "list-group"}, 
                            this.state.servers.map(function(server){
                                return React.createElement("li", {className: "list-group-item", onClick: () =>this.showServerDetail(server)}, server.name, " ", server.is_deletable ? React.createElement("button", {className: "btn btn-primary badge", onClick: ()=> this.delete_server(server.id)}, React.createElement("span", {className: "glyphicon glyphicon-trash"})) : null, " ")
                            }.bind(this))
                        ), 
                        React.createElement("div", {className: "server-detail"}, 
                            React.createElement("h4", null, this.state.curr_server!=null ? "Server Name: " + this.state.curr_server.name : ''), 
                            React.createElement("p", null, this.state.curr_server!=null ? "Server Url: " + this.state.curr_server.url : '')
                        )
                    )
                )
            )
        } 
    });
    var ResultDisplay = app.ResultDisplay = React.createClass({displayName: "ResultDisplay",
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
                React.createElement("div", {className: "result-container"}, 
                    React.createElement("div", {className: "result-head"}, React.createElement("span", {className: "area-title area-title-black"}, this.state.test_type!=null?"Test Type: "+this.state.test_type_str:""), " ", React.createElement("span", null)), 
                    React.createElement("div", {className: "detail-result"}, 
                        React.createElement("div", {className: "result-sum"}, 
                            this.state.test_type == 0 ? React.createElement("h3", null, "Level: ", this.state.level.map(function(l){
                                return React.createElement("span", null, l, ", ")
                            })) : null
                        ), 
                        this.state.steps.map(function(step){
                            return React.createElement(StepDisplay, {showFullyDetail: this.props.showFullyDetail, stepInfo: step})
                        },this)
                    )
                )
            )
        }
    });

    var HTTPDetail = app.HTTPDetail = React.createClass({displayName: "HTTPDetail",
        render:function(){
            return(
                React.createElement("div", {className: "http-area detail-result"}, 
                    
                    this.props.detail.req_header != null ? 
                        React.createElement("div", {className: "http-content"}, 
                        React.createElement("h4", null, "HTTP Request Header"), 
                        React.createElement("pre", null, JSON.stringify(JSON.parse(this.props.detail.req_header), null, 2) ), " "):
                        null, 
                    
                    
                    
                    this.props.detail.res_header != null ? 
                        React.createElement("div", {className: "http-content"}, 
                        React.createElement("h4", null, "HTTP Response Header"), 
                        React.createElement("pre", null, JSON.stringify(JSON.parse(this.props.detail.res_header), null, 2) )) :
                        null, 
                    
                    this.props.detail.response_message != null ?
                        React.createElement("div", {className: "http-content"}, 
                        React.createElement("h4", null, "Response Message"), 
                        React.createElement("pre", null, JSON.stringify(JSON.parse(this.props.detail.response_message), null, 2) ), " "): 
                        null, 
                    

                    this.props.detail.req_resource != null ?
                        React.createElement("div", {className: "http-content"}, 
                        React.createElement("h4", null, "Test Resource"), 
                        React.createElement("pre", null, JSON.stringify(JSON.parse(this.props.detail.req_resource), null, 2) )) :
                        null
                    

                )
            );
        }
    });

    var FullyDetail = app.FullyDetail = React.createClass({displayName: "FullyDetail",
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
                React.createElement("div", {className: "result-container"}, 
                this.state.is_image ? this.state.detail_infos.map(function(step){
                    return React.createElement("div", {id: step.index}, 
                        React.createElement("h3", null, step.name), 
                        step.status ? React.createElement("span", {className: "success-bar"}, "Success") : React.createElement("span", {className: "fail-bar"}, "Fail"), 
                        React.createElement("img", {onClick: () =>this.handleShowFullImage(event,step.addi), className: "img-responsive img-rounded step-img", src: app.host + step.addi})
                    )
                },this) :this.state.detail_infos.map(function(step){
                    return step.details.map(function(detail){
                        return React.createElement("div", {id: step.index + "_" + detail.index}, 
                                React.createElement("h3", null, step.name + " " + detail.resource_name), 
                                React.createElement("div", {className: "result-head"}, React.createElement("span", {className: "area-title area-title-black"}, "Test case detail "), 
                                detail.status==2 ? React.createElement("span", {className: "success-bar"}, "Success") : detail.status==1? React.createElement("span", {className: "warning-bar"}, "Warning") : React.createElement("span", {className: "fail-bar"}, "Fall")
                                ), 
                                React.createElement("div", {className: "detail-desc-block"}, 
                                        detail.desc
                                ), 
                                React.createElement(HTTPDetail, {detail: detail})
                            )
                    },this)
                },this), 
                this.state.is_modal_show && this.state.is_image ? React.createElement(Modal, {handleHideModal: this.handleHideModal, title: "Step Image", content: React.createElement(FullImageArea, {img_src: app.host + this.state.curr_img_src})}) : null
                )
            );
        }
    });

    var StepDisplay = app.StepDisplay = React.createClass({displayName: "StepDisplay",
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
                React.createElement("div", {className: "step-brief step-brief-success", onClick: this.handleTextClick}, 
                    React.createElement("div", null, React.createElement("span", {className: "step-brief-text"}, this.props.stepInfo.desc)), 
                    React.createElement("div", {className: "step-detail-area"}, 
                        React.createElement("div", {className: "detail-hint-block"}, 
                            this.props.stepInfo.details.map(function(detail){
                                return React.createElement(StepDetail, {sindex: this.props.stepInfo.index, fully_detail: detail, status: detail.status, desc: detail.desc, showDetail: this.showDetail})
                            }, this)
                        ), 
                        this.state.is_detail_showing ? React.createElement("div", {className: "detail-desc-block"}, 
                            this.state.detail_desc
                        ) : null
                        
                    ), 
                    React.createElement("div", {hidden: this.state.is_img_hide && !this.state.is_has_image, className: "step-img-block"}, 
                        
                       React.createElement("a", {href: "#"+this.props.stepInfo.index}, " ", React.createElement("img", {className: "img-responsive img-thumbnail step-img-small", src: app.host + this.props.stepInfo.addi}), " ")
                    ), 
                    this.state.is_modal_show && this.state.is_has_image ? React.createElement(Modal, {handleHideModal: this.handleHideModal, title: "Step Image", content: React.createElement(FullImageArea, {img_src: app.host + this.props.stepInfo.addi})}) : null
                )
            );
        }
    });
    var StepDetail = app.StepDetail = React.createClass({displayName: "StepDetail",
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
                React.createElement("a", {href: "#"+this.props.sindex+"_"+this.props.fully_detail.index, onClick: this.onBtnClick, className: 'btn btn-circle btn-'+this.state.btnStatus},  this.props.status==2 ? 'P' : this.props.status==1 ? 'W' : 'F')
            )
        }
    })
    app.UserBtnArea = React.createClass({displayName: "UserBtnArea",
        handleLogout:function(){
            $.removeCookie('fhir_token', { path: '/' });
            window.location.href = '/'
        },
        render:function(){
            return (
                React.createElement("div", {className: "user-op"}, 
                    React.createElement("button", {className: "btn btn-user", onClick: this.props.showMatrix}, "FHIR Matrix")
                )
            );
        }
    });
    var FullImageArea = app.FullImageArea = React.createClass({displayName: "FullImageArea",
        render:function(){
            return(
                React.createElement("img", {src: this.props.img_src, className: "img-responsive"})
            );
        }
    });
    var TaskItem = app.TaskItem = React.createClass({displayName: "TaskItem",
        handleClick:function(){
            this.props.itemClicked(this.props.task_id);
        },
        render:function(){
            return (
                React.createElement("div", {className: "list-item", onClick: this.handleClick}, 
                    React.createElement("span", null, "Task ID: "), this.props.task_id, 
                    React.createElement("span", {className: "pull-right"}, " Time: ", this.props.task_time)
                )
            );
        }
    });
    var TaskList = app.TaskList = React.createClass({displayName: "TaskList",
        render:function(){
            return (
                React.createElement("div", {className: "task-list"}, 
                    
                    React.createElement("div", {className: "list-content"}, 
                        this.props.tasks.map(function(task_info){
                            return React.createElement(TaskItem, {itemClicked: this.props.fetchTaskDetail, task_id: task_info.task_id, task_time: task_info.time})
                        },this)
                    )
                )
                );
        }
    });
    var TaskSearchView = app.TaskSearchView = React.createClass({displayName: "TaskSearchView",
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
                React.createElement("div", {className: "task-search-area"}, 
                    React.createElement("input", {className: "input-url", placeholder: "Search Tasks...", ref: "keywordField", onChange: this.onUserInput}), 
                    React.createElement("div", {className: "history-area"}, 
                    React.createElement(TaskList, {fetchTaskDetail: this.getTaskDetail, tasks: this.state.tasks}), 
                    React.createElement(ResultDisplay, {ref: "res_area"})
                    )
                )
            )
        }
    });
    app.MatrixArea = React.createClass({displayName: "MatrixArea",
        getInitialState:function(){
            return {'type':app.FHIR_TEST,'curr_title':'FHIR Test','time':'', time_list:[]};
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
                    $('[data-show="show"]').tooltip("show");
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
                    $('[data-show="show"]').tooltip("show");
                }.bind(this)
            })
        },
        componentDidMount:function(){
           $.get(app.host+ '/home/rmatrix', function (result) {
                app.drawMatrix(result);
            }.bind(this));
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-show="show"]').tooltip("show");
        },
        componentWillUpdate:function(){
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-show="show"]').tooltip("destroy");
        },
        transTypeTitle:function(ttype){
            if( ttype == app.FHIR_TEST){
                return 'FHIR Test';
            }else if( ttype == app.SERVER_TEST ){
                return 'Custom Server Test';
            }else if( ttype == app.STANDARD_TEST ){
                return 'Level Test';
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
            this.setState({'type':ttype, curr_title:ttype_title, time:''});
            this.updateTimeline(ttype);
            this.retriveNewMatrix(ttype, this.state.time);
        },
        updateTTime:function(event){
            var ttime = event.currentTarget.dataset.ttime;
            this.setState({'time':ttime})
            this.retriveNewMatrix(this.state.type, ttime);
        },
        render:function(){
            return (
                React.createElement("div", {className: "matrix-area"}, 
                React.createElement("div", {className: "title"}, React.createElement("h4", null, this.state.curr_title)), 
                    React.createElement("div", {className: "btn-area"}, 
                        React.createElement("button", {onClick: this.updateTType, className: "btn btn-primary btn-matrix", "data-ttype": app.FHIR_TEST}, "FHIR Test"), 
                        React.createElement("button", {onClick: this.updateTType, className: "btn btn-primary btn-matrix", "data-ttype": app.STANDARD_TEST}, "Level Test")
                    ), 
                    React.createElement("div", {className: "timeline"}, 
                    this.state.time_list.map(function(t, time_list){
                        console.log((Math.floor(this.state.time_list.length/4)));
                        if ((time_list%(Math.floor(this.state.time_list.length/4))) == 0) {
                            return React.createElement("div", {onClick: this.updateTTime, className: "timedot", "data-toggle": "tooltip", "data-show": "show", "data-ttime": t, "data-placement": "bottom", title: t})
                        }
                        return React.createElement("div", {onClick: this.updateTTime, className: "timedot", "data-toggle": "tooltip", "data-ttime": t, "data-placement": "bottom", title: t})
                    },this)
                    ), 
                    React.createElement("div", {id: "tips"}), 
                    React.createElement("div", {id: "matrix"})
                )
                )
        }
    });
    var HistoryViewer = app.HistoryViewer = React.createClass({displayName: "HistoryViewer",
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
                React.createElement("div", {className: "history-area"}, 
                    React.createElement(TaskList, {fetchTaskDetail: this.getTaskDetail, tasks: this.state.tasks}), 
                    React.createElement(ResultDisplay, {ref: "res_area"})
                )
            );
        }
    });
    var ReportView = app.ReportView = React.createClass({displayName: "ReportView",
        getCellStatus:function(status){
                if( status ){
                    return 'success'
                }else{
                    return 'danger'
                }
        },
        getTestTypeStr:function(type_code){
            if( type_code == app.FHIR_TEST ){
                return "FHIR Test"
            }else if( type_code == app.STANDARD_TEST ){
                return "Level Test"
            }else if( type_code == app.APP_TEST ){
                return "App Test"
            }else if( type_code == app.SERVER_TEST ){
                return "Server Test"
            }
        },
        render:function(){
            return(
                React.createElement("div", {className: "report-area"}, 
                    React.createElement("div", {className: "brief-info"}, 
                        React.createElement("h4", null, "Test Type: ", this.props.report.test_type!=null ? this.getTestTypeStr(this.props.report.test_type) : ""), 
                        React.createElement("h4", null, "Target Server: ", this.props.report.server), 
                        React.createElement("h4", null, "Level: ", this.props.report.level == null? null : this.props.report.level.map(function(l){
                            return React.createElement("span", null, l, ", ")
                        }))
                    ), 
                    React.createElement("div", {className: "table-info"}, 
                    React.createElement("h3", null, "Details"), 
                        React.createElement("table", {className: "table table-bordered"}, 
                        React.createElement("tbody", null, 
                        this.props.report.infos.map(function(info){
                            return (
                                React.createElement("tr", null, 
                                    React.createElement("td", null, info.name), 
                                    info.detail_infos.map(function(detail){
                                        return React.createElement("td", {className: this.getCellStatus(detail.status)}, detail.resource)
                                    },this), 
                                    React.createElement("td", {className: this.getCellStatus(info.status)}, " ", info.name, " ", info.status ? 'Passed' : 'Failed')
                                )
                            );
                        },this)
                        )
                        )
                    )
                )
            )
        }
    });
    var Modal = app.Modal = React.createClass({displayName: "Modal",
        componentDidMount(){
            $(ReactDOM.findDOMNode(this)).modal('show');
            $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);
        },
        render:function(){
            return (
                React.createElement("div", {className: "modal modal-wide fade"}, 
                    React.createElement("div", {className: "modal-dialog"}, 
                        React.createElement("div", {className: "modal-content"}, 
                            React.createElement("div", {className: "modal-header"}, 
                                React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
                                React.createElement("h4", {className: "modal-title"}, this.props.title)
                            ), 
                            React.createElement("div", {className: "modal-body"}, 
                                this.props.content
                            ), 
                            React.createElement("div", {className: "modal-footer text-center"}, 
                                React.createElement("button", {className: "btn btn-primary center-block", "data-dismiss": "modal"}, "Close")
                            )
                        )
                    )
                )
            );
        }
    });
})();