import { auth } from "@clerk/nextjs/server";

export const runtime = "edge";

export default function Page() {
  const { userId } = auth();
  return <div>{userId ? "SERVER LOGGED IN" : "SERVER NOT LOGGED IN"}</div>;
}
