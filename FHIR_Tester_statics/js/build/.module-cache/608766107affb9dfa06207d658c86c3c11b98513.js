var app = app || {};

(function() {
    app.APP_TEST = 1;
    app.STANDARD_TEST = 2;
    app.SERVER_TEST = 3;
    var TestButton  = app.TestButton;   
    function onChange(newCode) {
        console.log(newCode)
    }
    function render() {
        ReactDOM.render( 
            //<TestButton btn_name="App Test" btnType={app.APP_TEST}/> ,
            React.createElement(AceEditor, {
                mode: "java", 
                theme: "github", 
                name: "blah1", 
                height: "6em", 
                onChange: onChange}
            ),
            document.getElementById('main')
        );
    }
    render();
})();