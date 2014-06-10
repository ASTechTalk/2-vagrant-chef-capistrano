#
# Cookbook Name:: aws
# Recipe:: associate_eip
#
# Copyright (C) 2014 YOUR_NAME
#
# All rights reserved - Do Not Redistribute
#
include_recipe "aws"
aws = data_bag_item("aws", "main")

aws_elastic_ip "eip_load_balancer_production" do
  aws_access_key aws['aws_access_key_id']
  aws_secret_access_key aws['aws_secret_access_key']
  ip node[:aws][:eip]
  action :associate
end
