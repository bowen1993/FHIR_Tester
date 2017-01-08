var app = app || {};

var clipboard = new Clipboard('.Observation', {    
    text: function() {
    	var btn = document.getElementById('Observation'); 
        console.log("??1", app[btn.name]);
        return app[btn.name];
    }
});

var clipboard = new Clipboard('.Sequence', {    
    text: function() {
    	var btn = document.getElementById('Sequence'); 
        console.log("??2", app[btn.name]);
        return app[btn.name];
    }
});

var clipboard = new Clipboard('.FamilyMemberHistory', {    
    text: function() {
    	var btn = document.getElementById('FamilyMemberHistory'); 
        return app[btn.name];
    }
});

var clipboard = new Clipboard('.DiagnosticRequest', {    
    text: function() {
    	var btn = document.getElementById('DiagnosticRequest'); 
        return app[btn.name];
    }
});

var clipboard = new Clipboard('.DiagnosticReport', {    
    text: function() {
    	var btn = document.getElementById('DiagnosticReport'); 
        return app[btn.name];
    }
});

var auto_input = document.getElementById("serverlist");
var awesomplete = new Awesomplete(auto_input);

$.get(app.host+ '/home/servers', 
        function (result) {
            console.log("get!!");
            if( result.isSuccessful ){
                console.log("result!!");
                var arr = [];
                for (var i = 0; i < result.servers.length; i++) {
                    arr.push(result.servers[i].name)
                }
                awesomplete.list = arr;
                console.log("list: ", awesomplete);
            }
        });

