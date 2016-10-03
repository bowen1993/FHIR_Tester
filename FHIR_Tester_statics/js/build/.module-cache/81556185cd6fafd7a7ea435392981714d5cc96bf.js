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
        getInitialState: function(){
            return {
                is_img_hide:false
            }
        },
        render: function(){
            return (
                React.createElement("div", {className: "result-container bg-success"}, 
                    React.createElement("div", null, React.createElement("span", {className: "area-title area-title-black"}, "Test Type: "), " ", React.createElement("span", null, this.props.testType)), 
                    React.createElement("div", {className: "detail-result"}, 
                        React.createElement(StepDisplay, {is_img_show: this.state.is_img_show})
                    )
                )
            )
        }
    });

    var StepDisplay = app.StepDisplay = React.createClass({displayName: "StepDisplay",
        getInitialState: function(){
            return {
                is_img_hide:this.props.is_img_show
            }
        },
        render:function(){
            return (
                React.createElement("div", {className: "step-brief"}, 
                    React.createElement("span", {className: "step-brief-text"}, "This is a step info"), 
                    React.createElement("img", {hidden: !this.state.is_img_show, className: "img-responsive step-img", src: "../img/7.png"})
                )
            );
        }
    });

})();

