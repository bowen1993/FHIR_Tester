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

        var colors = [d3.rgb(30,105,180), d3.rgb(68,114,196),d3.rgb(53,135,176),d3.rgb(107,174,214),
				  	  d3.rgb(158,154,200),d3.rgb(122,116,180),d3.rgb(95,89,156),d3.rgb(53,57,133),
				  	  d3.rgb(23,125,127)];
				  	  

		var red = d3.rgb(253,141,60)
			green = d3.rgb(49,163,84)
			gray = d3.rgb(158, 202, 225);

        var c = function(idx, val){
            if( val == -1 ){				//	null
                return d3.rgb(198,219,239);
            }else if(val == 1){				//	error
            	return red;
            }else{
            	if (idx == 0) {				//	title
            		return gray;
            	}
            	// return green;				//	right
            	return colors[idx];
        	}
        }
        var matrix = [],
            servers = datas.servers,
            yn = servers.length,
            resources = datas.resources,
            xn = resources.length;

        var margin = {top: 50, right: 0, bottom: 10, left: 200},
            width = 700,
            height = 75 *yn;

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
		});


	console.log("matrix_arr: ", matrix);
	
	// Precompute the orders.
	var server_orders = {
	name: d3.range(yn).sort(function(a, b) { return d3.ascending(servers[a].name, servers[b].name); }),
	};
	var resource_orders = {
		name: d3.range(xn).sort(function(a,b){return d3.ascending(resources[a].name, resources[b].name); })
	}

	// console.log(server_orders);
	// console.log(resource_orders);
	
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
				cell.fname = resources[j].name;
				cell.name = resources[j].name.substr(0,3);
				cell.val = matrix[i][j].value;
				// console.log(cell);
				level_list.push(cell);
				cell = {};
			}
			serv.idx = level_list[0].idx;
			serv.fname = servers[i].name;
			serv.name = servers[i].name.substr(0,3);
			serv.children = level_list;
			server_list.push(serv);
			serv = {};
			level_list = [];
		}
		graph.idx = 0;
		graph.name = "matrix";
		graph.children = server_list;

		// console.log();
		console.log('matrix_obj: ', graph);

	    var nodes = partition.nodes(graph);
		var links = partition.links(nodes);

	console.log(nodes.slice(1,nodes.length));
	
	svg.append("rect")
	  .attr("class", "background")
	  .attr("width", width)
	  .attr("height", height);
	
	var rect = svg.selectAll("g").data(nodes.slice(1,nodes.length)).enter().append("g");

	rect.append("rect")
		.attr("x", function(d) { return d.x; })  
		.attr("y", function(d) { return d.y-110; })  
		.attr("width", function(d) { return d.dx; })  
		.attr("height", function(d) { return width*(1/2); })  
		.style("stroke", "#fff")
		.style("fill", function(d) { 
					return c(d.idx, d.val);
		})
		.on("mouseover", function(d){
			d.name = d.fname;
			rtxt.text(function(d,i) {	return d.name;	});
			// console.log("show full name", d.name);
		})
		.on("mouseout", function(d){
			d.name = d.name.substr(0,3);
			rtxt.text(function(d,i) {	return d.name;	});
			// console.log("show sub name", d.name);
		});

	var rtxt = rect.append("text")  
				.attr("class","node_text")
				.attr("text-anchor","middle")
				.style("fill", "#fff")
				.attr("transform",function(d,i){
					if (d.depth > 1) {
						return ("translate(" + (d.x + d.dx/2) + "," + (d.y+d.dy/2-50) + ")") + ("rotate(-90)");
					}
					return "translate(" + (d.x + d.dx/2) + "," + (d.y+d.dy/2-100) + ")";
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