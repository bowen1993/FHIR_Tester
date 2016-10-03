var app = app || {};

(function(){
    app.TestButton = React.createClass({displayName: "TestButton",
        handleClick: function() {
            this.props.submitTestTask(this.props.btnType);
        },
        render: function() {
            return ( React.createElement("button", {onClick:  this.handleClick, 
                className: "btn btn-test"}, " ", React.createElement("span", {className: "btn-test-text"}, " ",  this.props.btn_name, " ")) );
        }
    });
    app.CodeEditor = React.createClass({displayName: "CodeEditor",
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
                React.createElement("div", {id: "codeeditor", onKeyUp: this.handleType})
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
    app.UrlEditor = React.createClass({displayName: "UrlEditor",
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
                React.createElement("input", {className: this.classNames(), onChange: this.handleChange, ref: "urlInput", placeholder: "Type Server or App URL"})
            );
        }
    });
    var ServerList = app.ServerList = React.createClass({displayName: "ServerList",
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
                    React.createElement("div", {className: "dropdown server-list"}, 
                        React.createElement("button", {ref: "menu_display", className: "btn btn-default dropdown-toggle", type: "button", id: "dropdownMenu1", "data-toggle": "dropdown"}, 
                            this.state.currentDisplay, 
                            React.createElement("span", {className: "caret"})
                        ), 
                        React.createElement("ul", {className: "dropdown-menu", role: "menu", "aria-labelledby": "dropdownMenu1"}, 
                            this.state.servers.map(function(server){
                                return React.createElement("li", {role: "presentation"}, React.createElement("a", {"data-serverName": server.name, "data-serverid": server.id, onClick: this.onServerClick, role: "menuitem", tabindex: "-1", href: "#"}, server.name))
                            }.bind(this))
                        )
                    )
            );
        }
    })
    var ResultDisplay = app.ResultDisplay = React.createClass({displayName: "ResultDisplay",
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
                React.createElement("div", {className: "result-container"}, 
                    React.createElement("div", {className: "result-head"}, React.createElement("span", {className: "area-title area-title-black"}, "Test Type: "), " ", React.createElement("span", null, this.props.testType)), 
                    React.createElement("div", {className: "detail-result"}, 
                        React.createElement("div", {className: "result-sum"}, 
                            this.state.test_type == 0 ? React.createElement("h3", null, "Level: ", this.state.level) : null
                        ), 
                        this.state.steps.map(function(step){
                            return React.createElement(StepDisplay, {stepInfo: step})
                        })
                    )
                )
            )
        }
    });


    var StepDisplay = app.StepDisplay = React.createClass({displayName: "StepDisplay",
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
                React.createElement("div", {className: "step-brief step-brief-success", onClick: this.handleTextClick}, 
                    React.createElement("div", null, React.createElement("span", {className: "step-brief-text"}, this.props.stepInfo.desc)), 
                    React.createElement("div", {hidden: this.state.is_img_hide && !this.state.is_has_image, className: "step-img-block"}, 
                        React.createElement("button", {onClick: this.handleShowFullImage, className: "btn btn-primary"}, "Full Image"), 
                        React.createElement("img", {className: "img-responsive img-rounded step-img", src: this.props.stepInfo.addi})
                    ), 
                    this.state.is_modal_show && this.state.is_has_image ? React.createElement(Modal, {handleHideModal: this.handleHideModal, title: "Step Image", content: React.createElement(FullImageArea, {img_src: this.props.stepInfo.addi})}) : null
                )
            );
        }
    });
    app.UserBtnArea = React.createClass({displayName: "UserBtnArea",
        handleLogout:function(){
            app.showMsg("Logout");
        },
        render:function(){
            return (
                React.createElement("div", {className: "user-op"}, 
                    React.createElement("button", {className: "btn btn-user", onClick: this.props.history_action}, "History"), 
                    React.createElement("button", {className: "btn btn-user"}, "Search Task"), 
                    React.createElement("button", {className: "btn btn-user"}, "Change Password"), 
                    React.createElement("button", {className: "btn btn-user", onClick: this.handleLogout}, React.createElement("span", {className: "glyphicon glyphicon-off"}))
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
                    React.createElement("span", null, "Task ID:"), this.props.task_id
                )
            );
        }
    });
    var TaskList = app.TaskList = React.createClass({displayName: "TaskList",
        render:function(){
            return (
                React.createElement("div", {className: "task-list"}, 
                    React.createElement("h2", null, "History Tasks"), 
                    React.createElement("div", {className: "list-content"}, 
                        this.props.tasks.map(function(task_id){
                            return React.createElement(TaskItem, {itemClicked: this.props.fetchTaskDetail, task_id: task_id})
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
        onUserInput:function(){

        },
        render:function(){
            return (
                React.createElement("div", {className: "task-res-area"}, 
                    
                    React.createElement(TaskList, {fetchTaskDetail: this.getTaskDetail, tasks: this.state.tasks}), 
                    React.createElement(ResultDisplay, {ref: "res_area"})
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
                React.createElement("div", {className: "history-area"}, 
                    React.createElement(TaskList, {fetchTaskDetail: this.getTaskDetail, tasks: this.state.tasks}), 
                    React.createElement(ResultDisplay, {ref: "res_area"})
                )
            );
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

