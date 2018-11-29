json.items @items do |item|
  if ! item.borrower.present?
    json.id item.id
    json.name item.name
    json.desc item.description
    json.tags item.tags
    json.user item.user
    json.created_at item.created_at
    json.updated_at item.updated_at
    json.image rails_blob_url(item.image) if item.image.attached?
    json.total_hits item.hits
    json.hits_1week item.hits(1.week.ago)
  end
end

# JSON Containing results of the pages for items
json.pages do
	json.page @items.current_page
	json.perpage @per_page
	json.total_results @items.total_count
	json.total_pages @items.total_pages 

end




      # :current_page => @posts.current_page,
      # :per_page => @posts.per_page,
      # :total_entries => @posts.total_entries,
      # :entries => @posts
