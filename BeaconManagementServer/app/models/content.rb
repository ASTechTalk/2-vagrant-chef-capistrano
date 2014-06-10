class Content
  include Mongoid::Document
  field :uuid, type: String
  field :minor, type: Integer
  field :major, type: Integer
  field :identifier, type: String
  field :name, type: String
  field :image_data, type: String
  field :x, type: Integer
  field :y, type: Integer
end
