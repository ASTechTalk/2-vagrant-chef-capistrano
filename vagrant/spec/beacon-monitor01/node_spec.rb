require 'spec_helper'

describe command('/usr/local/lib/nodebrew/current/bin/node -v') do
    it { should return_stdout 'v0.10.28' }
end

describe command('/usr/local/lib/nodebrew/current/bin/npm list -g') do
    it { should return_stdout /forever/ }
end

