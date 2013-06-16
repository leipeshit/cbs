cbs_data = (function () {
  var values, category_arrays = {}, _aantal_inwoners;
  //private function
  function cast_and_create_fields(){
    var new_geomitries = [];
    _aantal_inwoners = d3.sum( values.objects.gemeenten.geometries, function(d) { return +d.properties.aantal_inwoners > 0 ? d.properties.aantal_inwoners : 0});
    values.objects.gemeenten.geometries.forEach(function(d, i) {
      //there are shapes for the sea and water, ignore them
      if(+d.properties.aantal_inwoners > 0){
        //convert percentages back to amounts
        //Burgerlijke stand
        d.properties.ongehuwd = +d.properties.aantal_inwoners * +d.properties.percentage_ongehuwd / 100;
        d.properties.gehuwd = +d.properties.aantal_inwoners * +d.properties.percentage_gehuwd / 100;
        d.properties.gescheid = +d.properties.aantal_inwoners * +d.properties.percentage_gescheid / 100;
        d.properties.verweduwd = +d.properties.aantal_inwoners * +d.properties.percentage_verweduwd / 100;
        //Leeftijd
        d.properties.personen_0_tot_15_jaar = +d.properties.aantal_inwoners * +d.properties.percentage_personen_0_tot_15_jaar / 100;
        d.properties.personen_15_tot_25_jaar = +d.properties.aantal_inwoners * +d.properties.percentage_personen_15_tot_25_jaar / 100;
        d.properties.personen_25_tot_45_jaar = +d.properties.aantal_inwoners * +d.properties.percentage_personen_25_tot_45_jaar / 100;
        d.properties.personen_45_tot_65_jaar = +d.properties.aantal_inwoners * +d.properties.percentage_personen_45_tot_65_jaar / 100;
        d.properties.personen_65_jaar_en_ouder = +d.properties.aantal_inwoners * +d.properties.percentage_personen_65_jaar_en_ouder / 100;

        //Huishouden
        d.properties.eenpersoonshuishoudens = +d.properties.aantal_inwoners * +d.properties.percentage_eenpersoonshuishoudens / 100;
        d.properties.huishoudens_met_kinderen = +d.properties.aantal_inwoners * +d.properties.percentage_huishoudens_met_kinderen / 100;
        d.properties.huishoudens_zonder_kinderen = +d.properties.aantal_inwoners * +d.properties.percentage_huishoudens_zonder_kinderen / 100;


        //Afkomst
        d.properties.westerse_allochtonen = +d.properties.aantal_inwoners * (+d.properties.percentage_westerse_allochtonen / 100);
        d.properties.niet_westerse_allochtonen = +d.properties.aantal_inwoners * (+d.properties.percentage_niet_westerse_allochtonen / 100);

        d.properties.autochtonen = +d.properties.aantal_inwoners - d.properties.niet_westerse_allochtonen - d.properties.westerse_allochtonen;

        //Missing percentages
        d.properties.percentage_mannen = +d.properties.mannen / +d.properties.aantal_inwoners  * 100;
        d.properties.percentage_vrouwen = +d.properties.vrouwen / +d.properties.aantal_inwoners  * 100;
        d.properties.percentage_autochtonen = d.properties.autochtonen / +d.properties.aantal_inwoners  * 100;
          //TODO:
        d.properties.percentage_aantal_inwoners = +d.properties.aantal_inwoners / _aantal_inwoners  * 100;
        new_geomitries.push(d);
      }
    });

    values.objects.gemeenten.geometries = new_geomitries;
  };
  var create_custom_data_arrays = function (){
    category_arrays.genders = [
        {key: "mannen", amount: 'mannen', percentage: 'percentage_mannen'},
        {key: "vrouwen", amount: 'vrouwen', percentage: 'percentage_vrouwen'}
    ];

    category_arrays.ages = [
        {key: "0 - 15", amount: 'personen_0_tot_15_jaar', percentage: 'percentage_personen_0_tot_15_jaar'},
        {key: "15 - 25", amount: 'personen_15_tot_25_jaar', percentage: 'percentage_personen_15_tot_25_jaar'},
        {key: "25 - 45", amount: 'personen_25_tot_45_jaar', percentage: 'percentage_personen_25_tot_45_jaar'},
        {key: "45 - 65", amount: 'personen_45_tot_65_jaar', percentage: 'percentage_personen_45_tot_65_jaar'},
        {key: "65+", amount: 'personen_65_jaar_en_ouder', percentage: 'percentage_personen_65_jaar_en_ouder'}
    ];

    category_arrays.households = [
        {key: "eenpersoons", amount: 'eenpersoonshuishoudens', percentage: 'percentage_eenpersoonshuishoudens'},
        {key: "met kinderen", amount: 'huishoudens_met_kinderen', percentage: 'percentage_huishoudens_met_kinderen'},
        {key: "zonder kinderen", amount: 'huishoudens_zonder_kinderen', percentage: 'percentage_huishoudens_zonder_kinderen'}
    ];

    category_arrays.civil_registrations = [
        {key: "gehuwd", amount: 'gehuwd', percentage: 'percentage_gehuwd'},
        {key: "gescheid", amount: 'gescheid', percentage: 'percentage_gescheid'},
        {key: "ongehuwd", amount: 'ongehuwd', percentage: 'percentage_ongehuwd'},
        {key: "verweduwd", amount: 'verweduwd', percentage: 'percentage_verweduwd'}
    ];

    category_arrays.lineages = [
        {key: "autochtonen", amount: 'autochtonen', percentage: 'percentage_autochtonen'},
        {key: "niet westerse allochtonen", amount: 'niet_westerse_allochtonen', percentage: 'percentage_niet_westerse_allochtonen'},
        {key: "westerse allochtonen", amount: 'westerse_allochtonen', percentage: 'percentage_westerse_allochtonen'},
    ];
  };
  return {
    set_data: function(json_data){
      values = json_data;
      cast_and_create_fields();
      create_custom_data_arrays();
      return values;
    },
    data : function(){
      return values;
    },
    collections : function(){
      return category_arrays;
    },
    geometries : function(){
      return values.objects.gemeenten.geometries;
    },
    totaal_aantal_inwoners : function(){
        return _aantal_inwoners;
    }
  }
})();