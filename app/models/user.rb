class User < ApplicationRecord
  validates :username, presence: true
  validates :password, presence: true

  validate :validate_username
  validate :validate_password

  private
  def validate_username
    if username.length < 10 || username.length > 50
      errors.add(:username, "must be between 10 - 50 characters")
    end
  end

  def validate_password
    if password.length < 20 || password.length > 50
      errors.add(:password, "must be between 20 - 50 characters")
    end

    if !(password =~ /[A-Za-z]/ && password =~ /\d/)
      errors.add(:password, "must contain at least 1 letter and 1 number")
    end

    require 'zxcvbn'
    strength = Zxcvbn.test(password).score
    if strength < 2
      errors.add(:password, "is too weak")
    end
  end
end
