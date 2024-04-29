import { parseNumber } from "@/utilities/parse-number";
import NextAuth, { User } from "next-auth";
import GitHub from "next-auth/providers/github";
import { KyselyAdapter } from "./keysely-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: KyselyAdapter(),
  callbacks: {
    jwt({ token, user }: { token: any; user: any }) {
      console.log({
        token,
        user,
      });
      if (user) token.roles = user.roles;
      return token;
    },
    session({ session, user }: { session: any; user: any }) {
      console.log({
        session,
        user,
      });
      session.user.roles = user.roles;
      return session;
    },
  },
  providers: [GitHub],
});

export interface AuthenticationUser extends User {
  name: string | null;
  email: string | null;
  provider: string | null;
  expires: string | null;
  roles: string[];
}

export async function getUser() {
  const session = await auth();
  const user: any = session?.user;
  if (session?.user == null) {
    return null;
  }
  const authUser: AuthenticationUser = {
    id: parseNumber(user.id ?? null),
    name: user.name ?? null,
    email: user.email ?? null,
    expires: session.expires,
    provider: "github",
    roles: user.roles?.toUpperCase()?.split(","),
  };

  return authUser;
}

export async function requiresRole(role: string) {
  const user = await getUser();
  if (user == null) {
    throw new Error("User not found");
  }
  if (!user.roles.includes(role)) {
    throw new Error("User does not have permission");
  }
  return;
}
