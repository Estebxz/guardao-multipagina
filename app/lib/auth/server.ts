import { auth, currentUser } from "@clerk/nextjs/server";

export async function getSecureUser() {
  const user = await currentUser();
  if (!user) return null;
  return user;
}

export async function getSecureSession() {
  const session = await auth();
  if (!session.userId) return null;
  return session;
}
