export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params
      },
      { abortEarly: false }
    );
    next();
  } catch (err) {
    const errors = err.inner.reduce((acc, error) => {
      const path = error.path.replace(/^(body|query|params)\./, '');
      acc[path] = error.message;
      return acc;
    }, {});

    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }
};
