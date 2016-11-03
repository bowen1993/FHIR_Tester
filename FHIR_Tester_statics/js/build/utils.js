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
        var c = function(number){
            if( number == 0 ){
                return "#d62728";
            }else if( number == 1 ){
                return "#2ca02c";
            }else{
                return "#c7c7c7";
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
        var x = d3.scale.ordinal().rangeBands([0, width]),
            y = d3.scale.ordinal().rangeBands([0,height]),
            z = d3.scale.linear().domain([0, 4]).clamp(true);
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
                matrix[i][j] = {x:i, y:j, z:-1}
            }
        }
        datas.links.forEach(function(link) {
	matrix[link.source][link.target].z = link.value;
	});
	console.log(matrix);

	// Precompute the orders.
	var server_orders = {
	name: d3.range(yn).sort(function(a, b) { return d3.ascending(servers[a].name, servers[b].name); }),
	};
	var resource_orders = {
		name: d3.range(xn).sort(function(a,b){return d3.ascending(resources[a].name, resources[b].name); })
	}
	console.log(server_orders);
	console.log(resource_orders);

  // The default sort order.
	x.domain(resource_orders.name);
	y.domain(server_orders.name);
	svg.append("rect")
	  .attr("class", "background")
	  .attr("width", width)
	  .attr("height", height);
	var row = svg.selectAll(".row")
	  .data(matrix)
	.enter().append("g")
	  .attr("class", "row")
	  .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; })
	  .each(rowf);

	row.append("line")
	  .attr("x2", width)
      .attr("stroke-width", 2);

	row.append("text")
	  .attr("x", -6)
	  .attr("y", y.rangeBand() / 2)
	  .attr("dy", ".32em")
	  .attr("text-anchor", "end")
	  .text(function(d, i) { return servers[i].name; });

	var column = svg.selectAll(".column")
	  .data(resources)
	.enter().append("g")
	  .attr("class", "column")
	  .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

	column.append("line")
	  .attr("x1", -width)
      .attr("stroke-width", 2);

	column.append("text")
	  .attr("x", 6)
	  .attr("y", x.rangeBand() / 2)
	  .attr("dy", ".32em")
	  .attr("text-anchor", "start")
	  .text(function(d, i) { return resources[i].name; });

	function rowf(row) {
        var cell = d3.select(this).selectAll(".cell")
        .data(row)
    .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.y); })
        .attr("width", x.rangeBand())
        .attr("height", y.rangeBand())
        .style("fill", function(d) { return c(d.z); });
    }
    }
})();