shizzle.utils = (function(){
    function get_quantile_domain(dataset, field){
        var percent_format = d3.format(".3r");
        var percent = function(value){
            if(value % 1 != 0){
                return +percent_format(value)
            }
            return +value
        }

        var max, min, domain_values;
         max = d3.max(dataset, function(d){
        //console.log(d);
          return +d.properties[field];
        });
        min = d3.min(dataset, function(d){
          return +d.properties[field];
        });
        domain_values = dataset.map(function(d){
          return +d.properties[field];
        });
      domain_values.sort(d3.ascending);

      var q1, q2, q3, q4, q5;
      q1 = percent(d3.quantile(domain_values, .125));
      q2 = percent(d3.quantile(domain_values, .375));
      q3 = percent(d3.quantile(domain_values, .5));
      q4 = percent(d3.quantile(domain_values, .625));
      q5 = percent(d3.quantile(domain_values, .875));

      //return array of 8 values

      var low_dif = q1 - min;
      var high_dif = max - q5;

      if(low_dif > high_dif){
          return [min, percent(min+low_dif/2), q1, q2, q3, q4, q5, max];
      }else{

        return [min, q1, q2, q3, q4, q5, percent(max-high_dif/2), max];
      }
  }

  return{
      quantiles : function(dataset, field){
        return get_quantile_domain(dataset, field)
      }
  }
})();