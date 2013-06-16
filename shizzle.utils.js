shizzle.utils = (function(){
    function get_quantile_domain(dataset, field){
      var max, min, domain_values;
         max = d3.max(dataset, function(d){
          return +d.properties[field];
        });
        min = d3.min(dataset, function(d){
          return +d.properties[field];
        });
        domain_values = dataset.map(function(d){
          return +d.properties[field];
        });
      domain_values.sort();

      var q1, q2, q3, q4, q5;
      q1 = (d3.quantile(domain_values, .125));
      q2 = (d3.quantile(domain_values, .375));
      q3 = (d3.quantile(domain_values, .5));
      q4 = (d3.quantile(domain_values, .625));
      q5 = (d3.quantile(domain_values, .875));
      //return array of 8 values
      var low_dif = q1 - min;
      var high_dif = max - q5;
      if(low_dif > high_dif){
        return [min, min+low_dif/2, q1, q2, q3, q4, q5, max];
      }else{
        return [min, q1, q2, q3, q4, q5, max-high_dif/2, max];
      }
  }

  return{
      quantiles : function(dataset, field){
        return get_quantile_domain(dataset, field)
      }
  }
})();