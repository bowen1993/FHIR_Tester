var app = app || {};

(function(){
    app.setup_websocket = function(task_id,place){
        console.log(task_id);
        var ws_scheme = window.location.protocol == "https" ? "wss" : "ws";
        var tasksocket = new ReconnectingWebSocket(ws_scheme + '://localhost:8000/task/' + task_id);
        tasksocket.onmessage = function(message){
            console.log(message.data);
            var data = JSON.parse(message.data);
            console.log(data);
            // console.log(window.comp)
            if(data.place == 1){
                window.comp.updateTestResult(data.step_result);
            }else if(data.place == 2){
                window.hist.updateTestResult(data.step_result);
            }else if(data.place == 3){
                window.searchView.updateTestResult(data.step_result);
            }
            
        }
        tasksocket.onopen = function(e){
            var data = {
                task_id:task_id,
                place:place
            }
            tasksocket.send(JSON.stringify(data));
        }

    }
})();