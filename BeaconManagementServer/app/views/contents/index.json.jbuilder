json.array!(@contents) do |content|
  json.extract! content, :id, :uuid, :minor, :major, :identifier, :name, :image_data
  json.url content_url(content, format: :json)
end
