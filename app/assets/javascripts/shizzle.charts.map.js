shizzle.charts.map = function(){
    var width = document.body.clientWidth,
      height = document.body.clientHeight;

    var svg, chart_data, color_by, color, domain, active, map, zoom, zoom_out;
    var  tooltip;
    var projection = d3.geo.mercator();
    var dimension_title = 'Inwoners';
    var dimension_sub_title = 'percentage totaal';
    var percentage_field = 'percentage_aantal_inwoners';
    var path = d3.geo.path()
        .projection(projection);

//    var percent = d3.format(".3r");
    //var data;
    var percent_format = d3.format(".2r");
        var percent = function(value){
            if(value % 1 != 0){
                return (+percent_format(value))+"%"
            }
            return (+value)+"%"
        }

    function chart(div) {
        //render chart


        div.each(function(){
            tooltip = d3.select("#map")
                    .append("div")
                    .attr("id", "tooltip")
                    .attr("class", "popover hidden");
            tooltip.append("div")
                    .attr("class", "arrow");
            tooltip.append("div")
                    .attr("class", "popover-title");
            tooltip.append("div")
                    .attr("class", "popover-content");
            var center = d3.geo.centroid(chart_data)
            svg = d3.select("#map").append("svg")
                .attr("width", width)
                .attr("height", height);
            projection
                .scale(1)
                .translate([0, 0])
                .center(center);

            var b = path.bounds(chart_data),
                s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
            zoom = s;
            projection
                .scale(s)
                .translate(t)
                .center(center);
            map = svg.append("g")
              .attr("class", "gemeenten")
              .attr("transform", "translate(-150,0)")
              .selectAll("path").data(chart_data.features);
            var gemeente = map.enter().append("path")
                .attr("class", "gemeente")
                .attr("d", path)
                .style("fill", function(d) {
                   return color( color_by(d) );
                });
                gemeente.on("mousemove", function(d,i) {
//                    console.log(percent(d));
                  var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
                  //TODO: custom tooltip injection
                  //TODO: if current is active, only update left and top style
                  tooltip
                    .classed("hidden", false)
                  tooltip.select(".popover-title")
                      .text(d.properties.gemeentenaam);
                    var color_style = "border-bottom: solid 5px " + color( color_by(d) ) + ";"
                  var html = "<table><tr><td>Aantal inwoners</td><td class='right'>" +d.properties.aantal_inwoners+"</td></tr>" +
                      "<tr><td>Aantal huishoudens</td><td class='right'>" + +d.properties.aantal_huishoudens +"</td></tr>" +
                      "<tr><td>Bevolkingsdichtheid</td><td class='right'>" + d.properties.bevolkingsdichtheid_inwoners_per_km2+"/km2</td></tr>" +

                      "<tr><td style='"+color_style+"'>"+dimension_title + ": " + dimension_sub_title +"</td><td style='"+color_style+"' class='right'>" +percent(+d.properties[percentage_field])+"</td></tr>" +
                      "</table>"
                    tooltip.select(".popover-content")
                      .html(html);
                     console.log(dimension_title);

                  var tooltip_bounds = tooltip.node().getBoundingClientRect();

                    //if top < 0, flip it around
                    if(mouse[1] < 180){
                        tooltip
                            .classed("bottom", true)
                            .classed("top", false)
                        tooltip.attr("style", "left:"+(mouse[0] - (tooltip_bounds.width / 2 ))+"px;top:"+(mouse[1] + 30)+"px")
                    }
                    else{
                        tooltip
                            .classed("bottom", false)
                            .classed("top", true)
                        tooltip.attr("style", "left:"+(mouse[0] - (tooltip_bounds.width / 2 ))+"px;top:"+(mouse[1] - tooltip_bounds.height - 30)+"px")
                    }
                })
                gemeente.on("mouseout",  function(d,i) {
                  tooltip.classed("hidden", true)
                })
                gemeente.on("click", click);
                });
                draw_legend('Inwoners', 'percentage totaal',color, domain)


    };
    chart.chart_data = function(value) {
      if (!arguments.length) return chart_data;
      chart_data = value;
      return chart;
    };
    chart.color = function(value) {
      if (!arguments.length) return color;
      color = value;
      return chart;
    };
    chart.color_by = function(value) {
      if (!arguments.length) return color_by;
      color_by = value;
      return chart;
    };
    chart.domain = function(value) {
      if (!arguments.length) return domain;
      domain = value;
      color.domain(domain);
      return chart;
    };
    chart.set_dimension = function(title, legend, data_keys, color_domain){
        var bisect = d3.bisector(function(d) { return d.key; }).right;
        percentage_field = data_keys[bisect(data_keys, legend) - 1].percentage;
        console.log(percentage_field);
        console.log(legend);
        var domain = shizzle.utils.quantiles(cbs_data.geometries(), percentage_field);
        color
          .domain( domain )
          .range(color_domain[9]);
        d3.selectAll(".gemeente").style("fill", function(d) {
           return color(
            +d.properties[percentage_field]
          );
        });
        dimension_title = title;
        dimension_sub_title = legend;
        draw_legend(title, legend, color, domain)
        color_by = (function(d){ return d.properties[percentage_field] });
        console.log(domain);
        //TODO: create new legend
    }
    chart.zoom_in = function(d) {

        if (active === d) return reset();
        tooltip.classed("hidden", true)
        map.selectAll(".active").classed("active", false);
        active = d;
        var b = path.bounds(d);
        var s = 5//(.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height));
        map.transition().duration(800).attr("transform",
            "translate(" + projection.translate() + ")"
            + "scale(" + s + ")"
            + "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");
        console.log(zoom);
        console.log(s);
        return chart;
    };
    chart.zoom_out = function(){
        map.selectAll(".active").classed("active", active = false);
        map.transition().duration(800).attr("transform", "");
        tooltip.classed("hidden", true);
        return chart;
    };
    var draw_legend = function(title, sub_title, color, domain){
        var legend_width = 400;
        var legend = svg.select("g.map_legend");
        var legend_bar_width = legend_width / domain.length
        if(! legend.empty()){
            legend.remove();
        }
        legend= svg.append("g")
            .attr("class", "map_legend")
            .attr("transform", "translate(" + 150 + ", "+ (document.body.clientHeight - 100) +")");
        legend.append("text")
           .attr("x", 0)
            .attr("y", -15)
            .attr("dy", "10px")
            .attr("class", "title")
            .text(title + ': ' + sub_title);

        var legend_group = legend.selectAll(".legend")
            .data(domain)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                console.log(i);
                var x = (i * legend_bar_width)
                return "translate(" + x + ", 0)";
            })
        legend_group.append("rect")
            .attr("width", legend_bar_width)
            .attr("height", 12)
            .style("fill", function(d, i) { return color(d) })
        legend_group.append("rect")
            .attr("width", legend_bar_width)
            .attr("height", 12)
            .style("fill", function(d, i) { return color(d) })

        legend_group.append("text")
                .attr("x", 5)
                .attr("y", 15)
                .attr("dy", "10px")
                .attr("class", "tick")
                .text(function(d) { return percent(d); });
    }


    return d3.rebind(chart);
}
