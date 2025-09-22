import { ReducedUser } from "@/types/user";
import { Avatar } from "@mui/material";

type Props = {
  user: ReducedUser | null;
};

const NavAvatar = ({ user }: Props) => {
  return (
    <Avatar sx={{ bgcolor: "primary.main", marginBottom: 2 }}>
      {user?.name?.charAt(0).toUpperCase()}
    </Avatar>
  );
};

export default NavAvatar;
