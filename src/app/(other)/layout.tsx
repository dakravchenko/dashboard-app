import Navbar from "@/components/NavBar";
import { authOptions } from "@/lib/authOptions";
import { ReducedUser } from "@/types/user";
import { getServerSession } from "next-auth";

export default async function OtherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Navbar user={session?.user as ReducedUser}/>
      {children}
    </>
  );
}
