class UsersController < ApplicationController
	
	#current_user is available through devise gem
  def show
    # @user = User.find(current_user.id)
    @user = User.find(params[:id])
  end

  def you
    puts "running UsersController#you"
    @user = User.find(current_user.id)
    render :show
  end


	
end
