var app = app || {};

(function(){
    app.isUrl = function(test_str){
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(test_str);
    }
    app.showMsg = function(msg){
        $('div.msg span').html(msg);
        $('div.msg').removeClass('hide');
        $('div.msg').show(200).delay(1000).hide(200);
    }
    app.drawMatrix = function(datas){

        var colors = [d3.rgb(143,143,143), d3.rgb(0,102,164),
				  	  d3.rgb(206,49,224),d3.rgb(230,227,27),
				  	  d3.rgb(27,230,89),d3.rgb(64,215,211)];

		var red = d3.rgb(211,26,26);

        var c = function(idx, val){
            if( val == 0 ){
                return red;
            }else{
            	return colors[idx];
        	}
        }
        var matrix = [],
            servers = datas.servers,
            yn = servers.length,
            resources = datas.resources,
            xn = resources.length;

        var margin = {top: 100, right: 0, bottom: 10, left: 200},
            width = 600,
            height = 55 *yn;

        var server = d3.scale.ordinal().rangeBands([0, width]),
            level = d3.scale.ordinal().rangeBands([0,height]),
            value = d3.scale.linear().domain([0, 4]).clamp(true);

        d3.select("#matrix").selectAll("*").remove();

        var svg = d3.select("#matrix").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("margin-left", margin.left + "px")
        	.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        servers.forEach(function(node, i) {
            node.index = i;
        });
        resources.forEach(function(node, i){
            node.index = i;
        });

        for( var i = 0; i < yn; i++ ){
            matrix[i] = []
            for( var j = 0; j < xn; j++ ){
                matrix[i][j] = {server:i, level:j, value:-1}
            }
        }
        datas.links.forEach(function(link) {
			matrix[link.source][link.target].value = link.value;
		}

		var partition = d3.layout.partition()
				.sort(null)
				.size([width, height])
				.value(function(d) { return 1; })
    
		// matrix transforming
		var graph = {};
		var server_list = [];
		var level_list = [];
		var serv = {};
		var cell = {};
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix[i].length; j++) {
				cell.idx = matrix[i][j].server;
				cell.name = resources[j].name;
				cell.value = matrix[i][j].value;
				level_list.push(cell);
				cell = {}
			}
			serv.idx = level_list[0].idx;
			serv.name = servers[i].name;
			serv.children = level_list;
			server_list.push(serv);
			serv = {};
			level_list = [];
		}
		graph.idx = 0;
		graph.name = "matrix";
		graph.children = server_list;

	    var nodes = partition.nodes(graph);
		var links = partition.links(nodes);
	);

	console.log(matrix);
	console.log(graph);
	// Precompute the orders.
	var server_orders = {
	name: d3.range(yn).sort(function(a, b) { return d3.ascending(servers[a].name, servers[b].name); }),
	};
	var resource_orders = {
		name: d3.range(xn).sort(function(a,b){return d3.ascending(resources[a].name, resources[b].name); })
	}

	console.log(server_orders);
	console.log(resource_orders);

	svg.append("rect")
	  .attr("class", "background")
	  .attr("width", width)
	  .attr("height", height);
	
	var rect = svg.selectAll("g").data(nodes).enter().append("g");

	rect.append("rect")
		.attr("x", function(d) { return d.x; })  
		.attr("y", function(d) { return d.y/2; })  
		.attr("width", function(d) { return d.dx; })  
		.attr("height", function(d) { return d.dy/2; })  
		.style("stroke", "#fff")
		.style("fill", function(d) { 
					return c(d.idx, d.value);
				});

	rect.append("text")  
		.attr("class","node_text")
		.attr("text-anchor","middle")
		.attr("transform",function(d,i){
			return "translate(" + (d.x + d.dx/2) + "," + (d.y/2+d.dy/4) + ")";
		}) 
		.text(function(d,i) {	return d.name;	});	
					
	// The default sort order.
	// x.domain(resource_orders.name);
	// y.domain(server_orders.name);

	// var row = svg.selectAll(".row")
	//   .data(matrix)
	// .enter().append("g")
	//   .attr("class", "row")
	//   .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; })
	//   .each(rowf);

	// row.append("line")
	//   .attr("x2", width)
 //      .attr("stroke-width", 2);

	// row.append("text")
	//   .attr("x", -6)
	//   .attr("y", y.rangeBand() / 2)
	//   .attr("dy", ".32em")
	//   .attr("text-anchor", "end")
	//   .text(function(d, i) { return servers[i].name; });

	// var column = svg.selectAll(".column")
	//   .data(resources)
	// 	.enter().append("g")
	//   .attr("class", "column")
	//   .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

	// column.append("line")
	//   .attr("x1", -width)
 //      .attr("stroke-width", 2);

	// column.append("text")
	//   .attr("x", 6)
	//   .attr("y", x.rangeBand() / 2)
	//   .attr("dy", ".32em")
	//   .attr("text-anchor", "start")
	//   .text(function(d, i) { return resources[i].name; });

	// function rowf(row) {
 //        var cell = d3.select(this).selectAll(".cell")
 //        .data(row)
 //    	.enter().append("rect")
 //        .attr("class", "cell")
 //        .attr("x", function(d) { return x(d.y); })
 //        .attr("width", x.rangeBand())
 //        .attr("height", y.rangeBand())
 //        .style("fill", function(d) { return c(d.z); });
 //    }
    }
})();