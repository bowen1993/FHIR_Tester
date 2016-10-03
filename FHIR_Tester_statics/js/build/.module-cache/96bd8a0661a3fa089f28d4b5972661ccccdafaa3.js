var app = app || {};

(function() {
    app.APP_TEST = 1;
    app.STANDARD_TEST = 2;
    app.SERVER_TEST = 3;
    var TestButton  = app.TestButton;   
    function render() {
        ReactDOM.render( 
            React.createElement(TestButton, {btn_name: "App Test", btnType: app.APP_TEST}) ,
            document.getElementById('main')
        );
    }
    render();
})();