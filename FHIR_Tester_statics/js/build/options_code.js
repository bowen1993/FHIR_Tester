var app = app || {};

var clipboard = new Clipboard('.options-code', {    
    text: function() {
    	var btn = document.getElementById('opt-code'); 
        return app[btn.value];
    }
});

clipboard.on('success', function(e) {
});

clipboard.on('error', function(e) {
    console.log(e);
});