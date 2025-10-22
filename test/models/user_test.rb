require "test_helper"

# NOTE: Not calling `.save` in these tests to avoid requiring the test database migrations. 
# NOTE: Only checking `.valid?` and `.errors` to test model validations.

class UserTest < ActiveSupport::TestCase
  # Presence validations
  test "invalid without username" do
    user = User.new(password: 'StrongPassword1234567890a')
    assert_not user.valid?
    assert_includes user.errors[:username], "can't be blank"
  end

  test "invalid without password" do
    user = User.new(username: 'ValidUsername123')
    assert_not user.valid?
    assert_includes user.errors[:password], "can't be blank"
  end

  # Username length
  test "invalid if username too short" do
    user = User.new(username: 'short', password: 'StrongPassword1234567890a')
    assert_not user.valid?
    assert_includes user.errors[:username], "must be between 10 - 50 characters"
  end

  test "invalid if username too long" do
    user = User.new(username: 'a'*51, password: 'StrongPassword1234567890a')
    assert_not user.valid?
    assert_includes user.errors[:username], "must be between 10 - 50 characters"
  end

  # Password requirements
  test "invalid if password too short" do
    user = User.new(username: 'ValidUsername123', password: 'short1a')
    assert_not user.valid?
    assert_includes user.errors[:password], "must be between 20 - 50 characters"
  end

  test "invalid if password too long" do
    user = User.new(username: 'ValidUsername123', password: 'a'*50 + '1')
    assert_not user.valid?
    assert_includes user.errors[:password], "must be between 10 - 50 characters"
  end

  test "invalid if password missing number" do
    user = User.new(username: 'ValidUsername123', password: 'a'*20 + 'A')
    assert_not user.valid?
    assert_includes user.errors[:password], "must contain at least 1 letter and 1 number"
  end

  test "invalid if password missing letter" do
    user = User.new(username: 'ValidUsername123', password: '1'*21)
    assert_not user.valid?
    assert_includes user.errors[:password], "must contain at least 1 letter and 1 number"
  end

  # Weak password (stub Zxcvbn to make deterministic)
  test "invalid if password too weak" do
    Zxcvbn.stub :test, OpenStruct.new(score: 1) do
      user = User.new(username: 'ValidUsername123', password: 'weakPassword1234567890')
      assert_not user.valid?
      assert_includes user.errors[:password], "is too weak"
    end
  end

  # Successful creation
  test "valid with strong password and proper username" do
    Zxcvbn.stub :test, OpenStruct.new(score: 3) do
      user = User.new(username: 'ValidUsername123', password: 'StrongPassword1234567890a')
      assert user.valid?
    end
  end
end