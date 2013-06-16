#Handles
#Couldn't drop papr_development : #<ActiveRecord::StatementInvalid: PG::Error: ERROR:  database "papr_development" is being accessed by other users
#ad described here http://stackoverflow.com/questions/2369744/rails-postgres-drop-error-database-is-being-accessed-by-other-users

task :kill_postgres_connections => :environment do
  db_name = "#{File.basename(Rails.root)}_#{Rails.env}"
  cmd = %(psql -c "SELECT pid, pg_terminate_backend(pid) as terminated FROM pg_stat_activity WHERE pid <> pg_backend_pid();" -d '#{db_name}')
  puts "WARN: killing connections to #{db_name}."
  unless system(cmd)
    fail $?.inspect
  end
end
#Adds the task to DB:drop? should look into this
task "db:drop" => :kill_postgres_connections
