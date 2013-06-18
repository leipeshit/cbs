shizzle.charts.donut = function(){
    if (!shizzle.charts.donut.id) shizzle.charts.donut.id = 0;
    var width = 350,
        height = 100,
        outerRadius = Math.min(width, height) * .5 - 10,
        innerRadius = outerRadius * .6;
    var pie = d3.layout.pie()
        .sort(function(d) { return d.key; })
        .value(function(d) { return d.value; });
    var arc = d3.svg.arc();
    var id = shizzle.charts.donut.id++;
    var data0,
        data1,
        data = [];
    var color;
    var color_range, update, data_keys, title, page_data, path, svg;
    var active_map;
    var thousands = d3.format(",f");
    function chart(div) {
        //render chart
        data_keys.forEach(function(data_key){
            data.push({ key: data_key.key, value: d3.sum( page_data, function(d) {
                return d.properties[data_key.amount]; })
            });
        });
        data0 = data;
        data1 = data;
        color = d3.scale.ordinal().range(color_range[data_keys.length + 1].reverse())
        div.each(function(){
            var div = d3.select(this);

            div.append("h4")
                .text(title);
            svg = div.append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("id", id);
            svg.selectAll(".arc")
                .data(arcs(data0, data1))
              .enter().append("g")
                .attr("class", "arc")
                .attr("transform", "translate(" + height / 2 + "," + height / 2 + ")")
              .append("path")
                .attr("fill", function(d, i) { return color(i); })
                .attr("d", arc)
              .on("click", function(d){ set_dimension(title, d.data.key, data_keys, color_range) });
            legend(data);
        });

    };
    function legend(legend_data){
        var legend_container = svg.select(".legend_container");
        if (legend_container.empty()){
            var legend_container =  svg.append("g")
          .attr("class", "legend_container")
          .attr("transform", "translate(" + height + "," + 10 + ")");
          //+It's gonna be LEGEND
          var legend = legend_container.selectAll(".legend")
            .data(legend_data)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                return "translate(0," + ((i * 15)) + ")";
            })
            .on("click", function(d){ set_dimension(title, d.key, data_keys, color_range) });
            //+WAIT FOR IT!!
            //colored boxes

            legend.append("rect")
              .attr("width", 12)
              .attr("height", 12)
              .style("fill", function(d, i) { return color(i) })

              //+WAIT FOR IT!!
              //type name
              legend.append("text")
                .attr("x", 15)
                .attr("y", 0)
                .attr("dy", "10px")
                .text(function(d) { return d.key; });

              //and I hope you're not lactose intolerant because the second half of that word is!!
              //value
              legend.append("text")
                .attr("x", 240)
                .attr("y", 0)
                .attr("dx", -3) // padding-right
                .attr("dy", "10px") // vertical-align: middle
                .attr("class", "legend_value")
                .text(function(d) { return thousands(d.value) });
              //+DAiRY!
        }else{
           var legend = legend_container.selectAll(".legend_value").data(legend_data);
           legend.text(function(d)  { return thousands(d.value) });
//▓▓▒▒▒▒▓▓▓▓▓▒▓▓▓▓▓▒▓▓▓▓▓▒▓▓▓▓▓▒▓▓▓▓▒▒▓▓▓▓▓▒▓▓▓▓▓▒▓▒▒▒▓▒
//▓▓▒▒▒▒▓▒▒▒▒▒▓▒▒▒▒▒▓▒▒▒▒▒▓▒▒▒▓▒▓▒▒▒▓▒▓▒▒▒▓▒▓▒▒▒▓▒▒▓▒▓▒▒
//▓▓▒▒▒▒▓▓▓▓▓▒▓▒▓▓▓▒▓▓▓▓▓▒▓▒▒▒▓▒▓▒▒▒▓▒▓▓▓▓▓▒▓▓▓▓▓▒▒▒▓▒▒▒
//▓▓▒▒▒▒▓▒▒▒▒▒▓▒▒▒▓▒▓▒▒▒▒▒▓▒▒▒▓▒▓▒▒▒▓▒▓▒▒▒▓▒▓▒▒▓▒▒▒▓▒▒▒▒
//▓▓▓▓▓▒▓▓▓▓▓▒▓▓▓▓▓▒▓▓▓▓▓▒▓▒▒▒▓▒▓▓▓▓▒▒▓▒▒▒▓▒▓▒▒▒▓▒▓▒▒▒▒▒
        }
    }
    function arcs(data0, data1) {
      var arcs0 = pie(data0),
          arcs1 = pie(data1),
          i = -1,
          arc;
        var n = data_keys.length;
      while (++i < n) {
        arc = arcs0[i];
        arc.innerRadius = innerRadius;
        arc.outerRadius = outerRadius;
        arc.next = arcs1[i];
      }
      return arcs0;
    }

    function transition(state) {
      var path = svg.selectAll(".arc > path")
          .data(state ? arcs(data0, data1) : arcs(data1, data0));

      // Wedges split into two rings.
      var t0 = path.transition()
          .duration(200)
          .attrTween("d", tweenArc(function(d, i) {
              return {
              innerRadius: i & 1 ? innerRadius : (innerRadius + outerRadius) / 2,
              outerRadius: i & 1 ? (innerRadius + outerRadius) / 2 : outerRadius
            };
          }));

      // Wedges translate to be centered on their final position.
      var t1 = t0.transition()
          .attrTween("d", tweenArc(function(d, i) {
            var a0 = d.next.startAngle + d.next.endAngle,
                a1 = d.startAngle - d.endAngle;
              return {
              startAngle: (a0 + a1) / 2,
              endAngle: (a0 - a1) / 2
            };
          }));

      // Wedges then update their values, changing size.
      var t2 = t1.transition()
            .attrTween("d", tweenArc(function(d, i) {
              return {
                startAngle: d.next.startAngle,
                endAngle: d.next.endAngle
              };
            }));

      // Wedges reunite into a single ring.
      var t3 = t2.transition()
          .attrTween("d", tweenArc(function(d, i) {
            return {
              innerRadius: innerRadius,
              outerRadius: outerRadius
            };
          }));

    }

    function tweenArc(b) {
      return function(a, i) {
        var d = b.call(this, a, i), i = d3.interpolate(a, d);
        for (var k in d) a[k] = d[k]; // update data
        return function(t) { return arc(i(t)); };
      };
    }

    chart.title = function(value) {
      if (!arguments.length) return title;
      title = value;
      return chart;
    };
    chart.data_keys = function(value) {
      if (!arguments.length) return data_keys;
      data_keys = value;
      return chart;
    };
    chart.color_range = function(value) {
      if (!arguments.length) return color_range;
      color_range = value;
      return chart;
    };

    chart.update = function(value) {
      if (!arguments.length) return update;
      update = value;
      return chart;
    };
    chart.page_data = function(value) {
      if (!arguments.length) return page_data;
      page_data = value;
      return chart;
    };
    chart.zoom_in = function(d) {
      if (active_map === d) return;
      var active = [];
      data_keys.forEach(function(data_key){
        active.push({ key: data_key.key, value: d.properties[data_key.amount] });
      });
      data1 = active;
//     data0 = data;
      active_map = d;
      transition(1);
      data0 = active;
      legend(active);
    }
    chart.zoom_out = function(d){
        data0 = data;
//      data0 = data;
      transition(0);
        active_map = false;
      legend(data);
    }
    return d3.rebind(chart);
}