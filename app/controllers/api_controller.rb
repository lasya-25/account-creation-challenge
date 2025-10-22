# frozen_string_literal: true

class ApiController < ApplicationController
    skip_before_action :verify_authenticity_token

    def create_account
        user = User.new(username: params[:username], password: params[:password])

        if user.save
            render json: { message: 'Account created successfully' }, status: :created
        else
            render json: { errors: user.errors.messages }, status: :unprocessable_entity
        end

    rescue => e
        render json: { error: 'An unexpected error occurred. Please try again later.' }, status: :internal_server_error
    end    
end
