import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Typography, Container } from "@mui/material";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4">Welcome {session.user?.email}</Typography>
    </Container>
  );
}