import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup.string().email("invalid email").required("email is required"), // "email is required" is a custom error message
    password: yup.string().required("password is required"),
  })
  .required();

export const registerSchema = yup
  .object({
    firstName: yup.string().required("first name is required"),
    lastName: yup.string().required("last name is required"),
    email: yup.string().email("invalid email").required("email is required"),
    password: yup.string().required("password is required"),
  })
  .required();