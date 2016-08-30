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
            this.editor.setTheme("ace/theme/clouds_midnight");
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
    app.ResultDisplay = React.createClass({
        render: function(){
            return (
                <div className="result-container">
                    <div className="result-head"><span className="area-title area-title-black">Test Type: </span> <span>{this.props.testType}</span></div>
                    <div className="detail-result">
                        <div className="result-sum">
                            <h3>Level: 1</h3>
                        </div>
                        <StepDisplay />
                    </div>
                </div>
            )
        }
    });

    var StepDisplay = app.StepDisplay = React.createClass({
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
                <div className="step-brief step-brief-failed" onClick={this.handleTextClick}>
                    <div><span  className="step-brief-text">This is a step info</span></div>
                    <div hidden={this.state.is_img_hide} className="step-img-block">
                        <button onClick={this.handleShowFullImage} className="btn btn-primary">Full Image</button>
                        <img className="img-responsive img-rounded step-img" src="../img/1.png" />
                    </div>
                    {this.state.is_modal_show ? <Modal handleHideModal={this.handleHideModal} title="Step Image" content={<FullImageArea img_src="../img/1.png" />} /> : null}
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

