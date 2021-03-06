# determine if the requesting user has the privilege to view detailed info about this user
if privilege(@user.id)

  # render full set of user info, including contact info
  json.partial! "users/user", user: @user

  # render items the user has listed
  json.items @user.items.reverse do |item|
    json.partial! "items/item", locals: { item: item }
  end

  # show items this user has borrowed
  json.items_borrowed @user.loans.reverse do |loan|
    if !loan.date_of_return.present?
      json.loan loan
      json.partial! "items/item", item: loan.item
      json.user  loan.item.user           # borrowed item user
    end
  end

  # shwo items this user has loaned out
  json.loaned_out_items @user.items do |item|
    if item.borrower.present?
      json.item do
        json.partial! "items/item", item: item
      end
      json.loan item.loan
      json.borrowing_user item.borrower
    end
  end

# if requesting user does NOT have full privilege to this user, show only identifying info  
else
  json.partial! "users/identity", user: @user   # render user id and name only
end


# flags used to determine privilege
json.private @user.privateMode
json.friend @friend
json.privilege @privilege
json.image rails_blob_url(@user.image) if @user.image.attached?