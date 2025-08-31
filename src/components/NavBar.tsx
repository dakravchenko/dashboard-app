"use client";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import NavAvatar from "./NavAvatar";
import { User } from "@/types/user";

const links = [
  { name: "Users", href: "/users" },
  { name: "Dashboards", href: "/dashboards" },
  { name: "Tasks", href: "/tasks" },
];

type Props = {
  user: User | null;
};

const Navbar = ({ user }: Props) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      {isSmallScreen ? (
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Logo
            </Typography>
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <List>
                {links.map((link) => (
                  <ListItem key={link.name}>
                    <Link href={link.href} passHref>
                      <ListItemText primary={link.name} />
                    </Link>
                  </ListItem>
                ))}
                <ListItem>
                  <Button variant="contained" color="secondary">
                    Log Out
                  </Button>
                </ListItem>
              </List>
            </Drawer>
          </Toolbar>
        </AppBar>
      ) : (
        <Drawer variant="permanent" anchor="left">
          <Box sx={{ width: 250, padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Logo
            </Typography>
            <NavAvatar user={user} />
            <List>
              {links.map((link) => (
                <ListItem key={link.name}>
                  <Link href={link.href} passHref>
                    <ListItemText primary={link.name} />
                  </Link>
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            >
              Log Out
            </Button>
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Navbar;
