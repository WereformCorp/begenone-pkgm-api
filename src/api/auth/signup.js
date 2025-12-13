import axios from "axios";

/**
 * Registers a new user after validating uniqueness.
 *
 * @param {Object} params - Signup request payload
 * @param {string} params.firstName - User first name
 * @param {string} params.secondName - User last name
 * @param {string} params.email - User email
 * @param {string} params.password - User password
 * @param {string} params.passwordConfirm - Password confirmation
 * @param {string} params.username - Public username
 * @param {string} params.USER_API_URL - User service base URL
 * @returns {Promise<Object>} Signup API response
 */
export const signup = async ({
  firstName,
  secondName,
  email,
  password,
  passwordConfirm,
  username,
  USER_API_URL,
  USER_CHECK_EXISTENCE_ENDPOINT,
  CREATE_USER_ENDPOINT,
}) => {
  console.log("Signup First Name:", firstName);
  console.log("Signup Second Name:", secondName);
  console.log("Signup Email:", email);
  console.log("Signup Password:", password);
  console.log("Signup Password Confirm:", passwordConfirm);
  console.log("Signup Username:", username);

  try {
    if (password !== passwordConfirm) {
      throw new Error("Passwords do not match");
    }

    // const USER_CHECK_EXISTENCE_ENDPOINT = "/api/v1/users/check-existence";

    // Step 1: Check if username or email already exists
    const existenceCheckRes = await axios.post(
      `${USER_API_URL}${USER_CHECK_EXISTENCE_ENDPOINT}`,
      {
        username,
        email,
      }
    );

    const message = existenceCheckRes.data.message;

    if (message === "username-exist") {
      throw new Error("Username already exists");
    }

    if (message === "email-exist") {
      throw new Error("Email already exists");
    }

    // Step 2: Final signup request
    const payload = {
      name: { firstName, secondName },
      username,
      eAddress: {
        email,
        password,
        passwordConfirm,
        passwordChangedAt: Date.now(),
      },
    };

    const response = await axios.post(
      `${USER_API_URL}/${CREATE_USER_ENDPOINT}`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error(
      "Signup Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
