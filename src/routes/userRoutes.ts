import { PrismaClientKnownRequestError } from 'prisma/prisma-client/runtime';
import { signInSchema, signUpSchema } from '../schema/userSchema';
import { createUser, getUserByEmailAndPassword } from '../services/userService';

const userRoutes = (server: any, _opts: any, done: () => void) => {
  server.post('/user/signin', {
    schema: signInSchema,
    handler: async (request: any, response: any) => {
      const { email, password, rememberMe } = request.body;
      let signOptions = {};
      if (!rememberMe) {
        signOptions = {
          ...signOptions,
          expiresIn: '7d',
        };
      }
      const user = await getUserByEmailAndPassword(email, password);
      if (user) {
        const { pseudo } = user;
        const token = server.jwt.sign({ userID: user.id, pseudo }, signOptions);
        return response.status(200).send({ token });
      }
      return response.status(401).send({ errorMsg: 'Invalid credentials.' });
    },
  });

  server.post('/user/signup', {
    schema: signUpSchema,
    handler: async (request: any, response: any) => {
      try {
        const newUser = await createUser(request.body);
        if (newUser) {
          const { rememberMe } = request.body;
          let signOptions = {};
          if (!rememberMe) {
            signOptions = {
              ...signOptions,
              expiresIn: '7d',
            };
          }
          const { name, avatar } = newUser;
          const token = server.jwt.sign({ userId: newUser.id, name, avatar }, signOptions);

          return response.status(201).send({ token });
        }
        return response.status(503).send({ errorMsg: 'User creation errored: newUser is undefined' });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          return response.status(409).send({ errorMsg: 'Either your pseudo or the email is already taken.' });
        }
        return response.status(503).send({ errorMsg: error });
      }
    },
  });

  done();
};

export default userRoutes;
