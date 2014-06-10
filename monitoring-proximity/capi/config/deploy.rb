# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'monitoring-proximity'
set :repo_url, 'git@bitbucket.org:asktkhr/monitoring-proximity.git'
set :branch, 'master'

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app
# set :deploy_to, '/var/www/my_app'
set :deploy_to, '/home/ubuntu/monitoring-proximity'

# Default value for :scm is :git
set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}
set :linked_dirs, %w{log node_modules}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
nodebrew_root_path = "/usr/local/lib/nodebrew"
set :default_env, { path: "#{nodebrew_root_path}/current/bin/:/opt/ruby/bin:$PATH",
                    nodebrew_root: nodebrew_root_path }

# Default value for keep_releases is 5
set :keep_releases, 5

set :node_cmd, "/usr/local/lib/nodebrew/current/bin/node"
set :npm_cmd, "/usr/local/lib/nodebrew/current/bin/npm"
set :forever_cmd, "#{current_path}/node_modules/forever/bin/forever"

namespace :deploy do

  desc "Stop Forever"
  task :started do
    on roles(:app) do
      execute "export PATH=#{nodebrew_root_path}/current/bin:$PATH && #{fetch(:forever_cmd)} stopall" ,raise_on_non_zero_exit: false
    end
  end

  desc "Install node modules non-globally"
  task :npm_install do
    on roles(:app) do
      execute "cd #{current_path} && #{fetch(:npm_cmd)} install"
    end
  end

  desc "Start forever"
  task :start_forever do
    on roles(:app) do
      execute "export PATH=#{nodebrew_root_path}/current/bin:$PATH && cd #{current_path} && #{fetch(:forever_cmd)} start app.js"
    end
  end
  before :published, 'deploy:restart'

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # This assumes you are using upstart to startup your application 
      # - be sure that your upstart script runs as the 'deploy' user
#      execute "sudo start node-upstart-script", raise_on_non_zero_exit: false
      execute "export PATH=#{nodebrew_root_path}/current/bin:$PATH && cd #{current_path} && #{fetch(:forever_cmd)} start app.js"
    end
  end

  before :restart, 'deploy:npm_install'

end
