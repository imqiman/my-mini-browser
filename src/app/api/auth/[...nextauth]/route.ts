import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Wallet Login',
      credentials: {
        walletAddress: { label: 'Wallet Address', type: 'text' },
        passphrase: { label: 'Passphrase', type: 'password' },
      },
      async authorize(credentials: any) {
        const walletAddress = credentials?.walletAddress as string | undefined;
        const passphrase = credentials?.passphrase as string | undefined;
        if (
          walletAddress?.toLowerCase() === '0x1234567890abcdef' &&
          passphrase === 'caffeine'
        ) {
          return {
            id: 'world-app-user-1',
            name: 'Caffeine Club Member',
            email: 'user@caffeine.club',
            walletAddress,
            username: 'caffeineuser',
            profilePictureUrl: 'https://cdn.world.org/profiles/default-avatar.png',
          };
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  pages: { signIn: '/login' },
  callbacks: {
    async session({ session, token }) {
      if (!session.user) {
        session.user = {
          id: '',
          name: '',
          email: '',
          emailVerified: null,
          walletAddress: '',
          username: '',
          profilePictureUrl: ''
        } as any;
      }

      if (token && typeof token.sub === 'string') {
        session.user.id = token.sub;
      }

      if ('walletAddress' in token) {
        (session.user as any).walletAddress = (token as any).walletAddress;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user && 'walletAddress' in user) {
        (token as any).walletAddress = (user as any).walletAddress;
      }
      return token;
    },
  },
});

export const GET = handler;
export const POST = handler;
