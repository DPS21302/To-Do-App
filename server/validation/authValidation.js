import * as yup from 'yup';

export const signupSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .required('Name is required')
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters'),

    email: yup
      .string()
      .required('Email is required')
      .email('Valid email is required')
      .lowercase()
      .trim(),

    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must not exceed 100 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),

    role: yup
      .string()
      .oneOf(['user', 'admin'], 'Invalid role')
      .default('user')
  })
});

export const loginSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .required('Email is required')
      .email('Valid email is required')
      .lowercase()
      .trim(),

    password: yup
      .string()
      .required('Password is required')
  })
});
