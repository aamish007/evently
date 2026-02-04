// app/clerk-test/page.tsx
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = auth();
  return <div>{userId ? 'CLERK WORKS' : 'CLERK NOT LOGGED IN'}</div>;
}
