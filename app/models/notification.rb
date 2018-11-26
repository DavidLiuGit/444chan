class Notification < ApplicationRecord

  #Sending the Notification Email 
  after_save :send_email

  belongs_to :recipient, class_name: "User"
  belongs_to :sender, class_name: "User"
  belongs_to :notifiable_object, polymorphic: true #notifiable object doesn't have one type


  scope :unread, ->{ where(read_at: nil)}


  #Email funciton
  def send_email
  	# Check the notification action here: 1.item_request => Item borrow Request Email, 2.accept_item_request => Your Request was Accepted
  	if (self[:action] == "item_request")
  		
  		# NotificationMailer.item_request_email(recepient_user).deliver

  		recepient_user = User.find_by_id(self[:recipient_id])
	    sending_user = User.find_by_id(self[:sender_id])
	    
	    request_id = (self[:notifiable_object_id])
	    item = Item.find( (Request.find(request_id)).item_id );
	    
	    params = []
	    params = Array.new
	    params.push << recepient_user
	    params.push << sending_user
	    params.push << item

	    # puts("Requested Item is #{item.name}")
  		# NotificationMailer.item_request_email(recepient_user,sending_user,item_name).deliver
  		NotificationMailer.item_request_email(params).deliver

  	elsif (Notification.action == "accept_item_request")
  	
  	end

  end

end
