import AlignCenter from "@/components/utilities/AlignCenter";
import { auth, requiresRole, signIn } from "@/server/auth";

export default async function Home() {
  await requiresRole("GLOBAL_ADMIN");
  const currentAuth = await auth();
  if (currentAuth == null) {
    await signIn("GitHub");
  }
  return <AlignCenter>Hello World</AlignCenter>;
}
