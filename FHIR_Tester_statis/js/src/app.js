var app = app || {};

(function() {
    app.APP_TEST = 1;
    app.STANDARD_TEST = 2;
    app.SERVER_TEST = 3;
    var TestButton = React.createClass({
        handleClick: function() {
            //this.props.submitTestTask(this.props.btnType);

        },
        render: function() {
            return ( <button onClick = { this.handleClick }
                className = "btn btn-test"> <span className = "btn-test-text"> { this.props.btn_name } </span></button> );

        }
    });
    
    function render() {
        ReactDOM.render( 
            <TestButton btn_name="App Test" btnType={app.APP_TEST}/> ,
            document.getElementById('main')
        );
    }
    render();
})();