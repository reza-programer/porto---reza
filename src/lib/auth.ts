import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/** Signs admin sessions and the visitor access cookie. Set NEXTAUTH_SECRET in production. */
export const AUTH_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key-change-in-production';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminUsername = process.env.ADMIN_USERNAME || 'reza';
        const adminPassword = process.env.ADMIN_PASSWORD || 'kuningan25022003';

        if (
          credentials?.username === adminUsername &&
          credentials?.password === adminPassword
        ) {
          return {
            id: '1',
            name: 'Reza',
            email: 'reza25022003@gmail.com',
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: AUTH_SECRET,
};
