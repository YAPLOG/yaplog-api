const signInSchema = {
  description: 'Sign in',
  tags: ['Users'],
  body: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
      rememberMe: { type: 'boolean' },
    },
    required: ['email', 'password', 'rememberMe'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
    401: {
      description: 'Invalid credentials',
      type: 'object',
      properties: {
        errorMsg: {
          type: 'string',
          default: 'Invalid credentials.',
        },
      },
    },
  },
};

const signUpSchema = {
  description: 'Sign up',
  tags: ['Users'],
  body: {
    type: 'object',
    properties: {
      avatar: { type: 'string' },
      name: { type: 'string' },
      password: { type: 'string' },
      email: { type: 'string' },
      rememberMe: { type: 'boolean' },
    },
    required: ['email', 'password', 'name', 'rememberMe'],
  },
  response: {
    201: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
    409: {
      description: 'name or email already taken.',
      type: 'object',
      properties: {
        errorMsg: {
          type: 'string',
          default: 'Either your name or your email is already taken.',
        },
      },
    },
    503: {
      description: 'Internal Server Error',
      type: 'object',
      properties: {
        errorMsg: {
          type: 'string',
        },
      },
    },
  },
};

export {
  signInSchema,
  signUpSchema,
};
