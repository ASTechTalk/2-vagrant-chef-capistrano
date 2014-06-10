require 'spec_helper'

describe command('redis-server -v') do
  it { should return_stdout /2.6.17/}
end

describe process('redis-server') do
  it { should be_running }
end

describe service('redis') do
  it { should be_enabled }
end

describe port(6379) do
  it { should be_listening.with('tcp') }
end
