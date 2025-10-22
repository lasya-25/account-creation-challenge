require "test_helper"

class ApiControllerTest < ActionDispatch::IntegrationTest
  test "should create account with valid params" do
    post '/api/create-account', params: {
      username: 'validusername123',
      password: 'StrongPassword1234567890'
    }
    assert_response :created
    json = JSON.parse(response.body)
    assert_equal 'Account created successfully', json['message']
  end

  test "should fail when username is too short" do
    post '/api/create-account', params: {
      username: 'short',
      password: 'StrongPassword1234567890'
    }
    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert_includes json['errors']['username'], 'must be between 10 - 50 characters'
  end

  test "should fail when username is too long" do
    post '/api/create-account', params: {
      username: 'a' * 51,
      password: 'StrongPassword1234567890'
    }
    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert_includes json['errors']['username'], 'must be between 10 - 50 characters'
  end

  test "should fail when password is too short" do
    post '/api/create-account', params: {
      username: 'validusername123',
      password: 'short1A'
    }
    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert_includes json['errors']['password'], 'must be between 20 - 50 characters'
  end

  test "should fail when password is too long" do
    post '/api/create-account', params: {
      username: 'validusername123',
      password: 'A' * 51 + '1'
    }
    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert_includes json['errors']['password'], 'must be between 20 - 50 characters'
  end

  test "should fail when password lacks a number" do
    post '/api/create-account', params: {
      username: 'validusername123',
      password: 'StrongPasswordWithoutDigits'
    }
    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert_includes json['errors']['password'], 'must contain at least 1 letter and 1 number'
  end

  test "should fail when password lacks a letter" do
    post '/api/create-account', params: {
      username: 'validusername123',
      password: '12345678901234567890'
    }
    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert_includes json['errors']['password'], 'must contain at least 1 letter and 1 number'
  end

  test "should fail when password is too weak" do
    post '/api/create-account', params: {
      username: 'validusername123',
      password: 'aaaaaaaaaaaaaaaaaaaa1' # weak password
    }
    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert_includes json['errors']['password'], 'is too weak'
  end

  test "should handle unexpected error" do
    User.stub(:new, ->(*) { raise StandardError.new("fail") }) do
      post '/api/create-account', params: {
        username: 'validusername123',
        password: 'StrongPassword1234567890'
      }
      assert_response :internal_server_error
      json = JSON.parse(response.body)
      assert_equal 'An unexpected error occurred. Please try again later.', json['error']
    end
  end
end