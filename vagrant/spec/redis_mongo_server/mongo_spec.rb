require 'spec_helper'

describe package('mongodb') do
  it { should be_installed }
end

describe process('mongod') do
    it { should be_running }
end

describe service('mongodb') do
  it { should be_enabled }
end

describe port(27017) do
  it { should be_listening.with('tcp') }
end

