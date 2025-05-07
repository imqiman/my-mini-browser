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
      const sess: any = session;
      if (token && (token as any).walletAddress) {
        sess.user.id = token.sub;
        sess.user.walletAddress = (token as any).walletAddress;
      }
      return sess;
    },
    async jwt({ token, user }) {
      if (user && (user as any).walletAddress) {
        (token as any).walletAddress = (user as any).walletAddress;
      }
      return token;
    },
  },
});

export const GET = handler;
export const POST = handler;
