D3Tests::Application.routes.draw do
  resources :municipalities do
    collection { post :import }
  end
  root :to => 'municipalities#index'
end
