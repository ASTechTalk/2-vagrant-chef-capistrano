server 'beacon-monitor01',
  user: 'ubuntu',
  roles: %w{app},
  ssh_options: {
    user: 'ubuntu',
    keys: %W(#{ENV['HOME']}/.ssh/private_key.pem),
    forward_agent: true,
    auth_methods: %w(publickey)
  }

