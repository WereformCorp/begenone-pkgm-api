import axios from "axios";

export const signup = async ({
  firstName,
  secondName,
  email,
  password,
  passwordConfirm,
  username,
  USER_API_URL,
}) => {
  console.log(`First Name: `, firstName);
  console.log(`Second Name: `, secondName);
  console.log(`Email: `, email);
  console.log(`Password: `, password);
  console.log(`Password Confirm: `, passwordConfirm);
  console.log(`Username: `, username);

  try {
    if (password !== passwordConfirm) {
      throw new Error("Passwords do not match");
    }

    const USER_CHECK_EXISTENCE_ENDPOINT = "/api/v1/users/check-existence";

    // Check if username or email already exists
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

    // Final signup request
    const res = await axios.post(`${USER_API_URL}/api/v1/users/user/`, {
      name: { firstName, secondName },
      username,
      eAddress: {
        email,
        password,
        passwordConfirm,
        passwordChangedAt: Date.now(),
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      "Login error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
