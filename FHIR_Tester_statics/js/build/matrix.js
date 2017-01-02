		console.log("d3 start");

		var width = 600,
			height = 300,
			color = d3.scale.category20();

		var colors = [d3.rgb(143,143,143), d3.rgb(0,102,164),
					  d3.rgb(206,49,224),d3.rgb(230,227,27),
					  d3.rgb(27,230,89),d3.rgb(64,215,211)];

		var red = d3.rgb(211,26,26);
			
		var svg = d3.select(".visualization").append("svg")
					.attr("width", width)
					.attr("height", height)
					.append("g"); 

		var partition = d3.layout.partition()
						  .sort(null)
						  .size([width, height])
						  .value(function(d) { return 1; })

		d3.json('data.json', function(error, roots){


			var nodes = partition.nodes(roots);
			var links = partition.links(nodes);

			console.log(svg);

			var rect = svg.selectAll("g").data(nodes).enter().append("g");

			console.log(rect);

			rect.append("rect")
				.attr("x", function(d) { return d.x; })  
				.attr("y", function(d) { return d.y/2; })  
				.attr("width", function(d) { return d.dx; })  
				.attr("height", function(d) { return d.dy/2; })  
				.style("stroke", "#fff")
				.style("fill", function(d) { 
					if (d.values == 0 || d.result == 0) {
						return red;
					}
					if (d.index == undefined) {
						return colors[d.parent.index];
					}
					return colors[d.index]; 
				});

			rect.append("text")  
				.attr("class","node_text")
				.attr("text-anchor","middle")
				.attr("transform",function(d,i){
					return "translate(" + (d.x + d.dx/2) + "," + (d.y/2+d.dy/4) + ")";
				}) 
				.text(function(d,i) {
					return d.name;	
				});
		});