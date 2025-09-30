// apps/web/src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { User } from 'next-auth';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const res = await axios.post(
            `${process.env.NEXTAUTH_URL}/api/v1/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            },
          );

          const backendResponse = res.data;

          if (backendResponse && backendResponse.access_token) {
            const payload = JSON.parse(
              Buffer.from(
                backendResponse.access_token.split('.')[1],
                'base64',
              ).toString(),
            );
            
            return {
              id: payload.sub,
              email: payload.email,
              accessToken: backendResponse.access_token,
            };
          }
          return null;
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
