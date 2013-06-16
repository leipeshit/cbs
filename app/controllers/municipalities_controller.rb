class MunicipalitiesController < ApplicationController

  def index
    #@municipalities = Municipality.all
    respond_to do |format|
      format.html
      #format.json { render :json => @municipalities, :root => "features", :meta => "FeatureCollection", :meta_key => 'type' }
    end
  end
end