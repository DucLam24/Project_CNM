/* eslint-disable no-useless-escape */
const requiredValidation = { required: "This field is require!" };
const authValidation = {
  username: { ...requiredValidation },
  email: {
    ...requiredValidation,
    pattern: {
      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      message: "Invalid email!",
    },
  },
  password: {
    ...requiredValidation,
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
    // pattern: {
    //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/,
    //   message:
    //     "Password must contains uppercase, lowercase, special character & numeric value",
    // },
  },
};

export { requiredValidation, authValidation };
