import NextAuth from 'next-auth';
import authConfig from '../../../../auth';

const handler = NextAuth({
  ...authConfig,
  trusted: ['https://2c16-12-248-251-234.ngrok-free.app'],
});

const { auth } = handler;

export const GET = handler;
export const POST = handler;
