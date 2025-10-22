class ApiControllerTest < ActionDispatch::IntegrationTest
  test "password_strength" do
    post api_password_strength_path, params: { password: '123' }
    assert_response :success
    assert_equal response.body, "{\"score\":0}"
  end

  test "create_account fails with missing username" do
    post api_create_account_path, params: { password: '123' }
    assert_response :success
    assert_equal JSON.parse(response.body)['error'], "param is missing or the value is empty: username"
  end

  test "create_account fails with missing password" do
    post api_create_account_path, params: { username: '123' }
    assert_response :success
    assert_equal JSON.parse(response.body)['error'], "param is missing or the value is empty: password"
  end

  test "create_account fails with invalid username" do
    post api_create_account_path, params: { username: '123456789', password: '1234567890123456789a' }
    assert_response :success
    assert_equal JSON.parse(response.body)['error'], "Invalid username"
  end

  test "create_account fails with invalid password" do
    post api_create_account_path, params: { username: '1234567890', password: '1234567890123456789' }
    assert_response :success
    assert_equal JSON.parse(response.body)['error'], "Invalid password"
  end

  test "create_account succeeds with valid username and password" do
    post api_create_account_path, params: { username: '1234567890', password: '1234567890123456789a' }
    assert_response :success
    assert_equal JSON.parse(response.body)['success'], true
  end

  test "should create account with valid params" do
    post '/api/create-account', params: { username: 'validusername123', password: 'validpassword123' }
    assert_response :created
    json = JSON.parse(@response.body)
    assert_equal 'Account created successfully', json['message']
  end

  test "should return errors with invalid params" do
    post '/api/create-account', params: { username: '', password: '' }
    assert_response :unprocessable_entity
    json = JSON.parse(@response.body)
    assert json['errors'].present?
  end

  test "should handle unexpected error" do
    User.stub(:new, ->(*) { raise StandardError.new("fail") }) do
      post '/api/create-account', params: { username: 'user', password: 'pass' }
      assert_response :internal_server_error
      json = JSON.parse(@response.body)
      assert_equal 'An unexpected error occurred. Please try again later.', json['error']
    end
  end
end
