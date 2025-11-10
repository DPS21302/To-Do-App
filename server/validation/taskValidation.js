import * as yup from 'yup';

export const createTaskSchema = yup.object({
  body: yup.object({
    title: yup
      .string()
      .required('Title is required')
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must not exceed 200 characters'),

    description: yup
      .string()
      .nullable()
      .transform((value) => value === '' ? null : value)
      .trim()
      .max(1000, 'Description must not exceed 1000 characters')
      .optional(),

    dueDate: yup
      .date()
      .required('Due date is required')
      .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Due date cannot be in the past'),

    category: yup
      .string()
      .required('Category is required')
      .oneOf(['Home', 'Personal', 'Office', 'Other'], 'Invalid category'),

    priority: yup
      .string()
      .oneOf(['low', 'medium', 'high'], 'Invalid priority')
      .default('medium'),

    status: yup
      .string()
      .oneOf(['pending', 'in-progress', 'completed'], 'Invalid status')
      .default('pending'),

    assignedTo: yup
      .string()
      .nullable()
      .transform((value) => value === '' ? null : value)
      .matches(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
      .optional()
  })
});

export const updateTaskSchema = yup.object({
  body: yup.object({
    title: yup
      .string()
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must not exceed 200 characters')
      .optional(),

    description: yup
      .string()
      .nullable()
      .transform((value) => value === '' ? null : value)
      .trim()
      .max(1000, 'Description must not exceed 1000 characters')
      .optional(),

    dueDate: yup
      .date()
      .optional(),

    category: yup
      .string()
      .oneOf(['Home', 'Personal', 'Office', 'Other'], 'Invalid category')
      .optional(),

    priority: yup
      .string()
      .oneOf(['low', 'medium', 'high'], 'Invalid priority')
      .optional(),

    status: yup
      .string()
      .oneOf(['pending', 'in-progress', 'completed'], 'Invalid status')
      .optional(),

    assignedTo: yup
      .string()
      .nullable()
      .transform((value) => value === '' ? null : value)
      .matches(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
      .optional()
  })
});
