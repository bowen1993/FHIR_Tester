var clipboard = new Clipboard('.Observation', {    
    text: function() {
    	var btn = document.getElementById('Observation'); 
        return app[btn.name];
    }
});

var clipboard = new Clipboard('.Sequence', {    
    text: function() {
    	var btn = document.getElementById('Sequence'); 
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
