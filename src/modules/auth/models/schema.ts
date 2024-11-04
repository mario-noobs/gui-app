import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup.string().email("invalid email").required("email is required"), // "email is required" is a custom error message
    password: yup.string().required("password is required"),
  })
  .required();

export const registerSchema = yup
  .object({
    first_name: yup.string().required("first name is required"),
    last_name: yup.string().required("last name is required"),
    auth_email_password: yup.object({
      email: yup.string().email("invalid email").required("email is required"),
      password: yup.string().required("password is required"),
    }).required("auth_email_password is required"),
  })
  .required();