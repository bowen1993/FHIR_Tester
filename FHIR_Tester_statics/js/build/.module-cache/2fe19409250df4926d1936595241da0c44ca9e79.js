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
            this.editor.setTheme("ace/theme/clouds_midnight");
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
            var new_token = this.refs.tokenInout
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
    app.ResultDisplay = React.createClass({displayName: "ResultDisplay",
        render: function(){
            return (
                React.createElement("div", {className: "result-container"}, 
                    React.createElement("div", {className: "result-head"}, React.createElement("span", {className: "area-title area-title-black"}, "Test Type: "), " ", React.createElement("span", null, this.props.testType)), 
                    React.createElement("div", {className: "detail-result"}, 
                        React.createElement("div", {className: "result-sum"}, 
                            React.createElement("h3", null, "Level: 1")
                        ), 
                        React.createElement(StepDisplay, null)
                    )
                )
            )
        }
    });

    var StepDisplay = app.StepDisplay = React.createClass({displayName: "StepDisplay",
        getInitialState: function(){
            return {
                is_img_hide:true,
                is_modal_show:false
            }
        },
        handleTextClick:function(){
            this.setState({is_img_hide:!this.state.is_img_hide});
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
                React.createElement("div", {className: "step-brief step-brief-failed", onClick: this.handleTextClick}, 
                    React.createElement("div", null, React.createElement("span", {className: "step-brief-text"}, "This is a step info")), 
                    React.createElement("div", {hidden: this.state.is_img_hide, className: "step-img-block"}, 
                        React.createElement("button", {onClick: this.handleShowFullImage, className: "btn btn-primary"}, "Full Image"), 
                        React.createElement("img", {className: "img-responsive img-rounded step-img", src: "../img/1.png"})
                    ), 
                    this.state.is_modal_show ? React.createElement(Modal, {handleHideModal: this.handleHideModal, title: "Step Image", content: React.createElement(FullImageArea, {img_src: "../img/1.png"})}) : null
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

