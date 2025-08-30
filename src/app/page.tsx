import { getServerSession } from "next-auth";
import { Typography, Container } from "@mui/material";
import { authOptions } from "@/lib/authOptions";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4">Welcome {session?.user?.email}</Typography>
    </Container>
  );
}