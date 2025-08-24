"use client";
import {
  AppBar,
  Avatar,
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
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Role } from "@prisma/client";

type User = {
  name: string;
  id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

const Navbar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: session } = useSession();

  if (!session) return null;

  const currentUser = session.user as User;

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const links = [
    { name: "Users", href: "/users" },
    { name: "Dashboards", href: "/dashboards" },
    { name: "Tasks", href: "/tasks" },
  ];

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
                  <ListItem component="a" href={link.href} key={link.name}>
                    <ListItemText primary={link.name} />
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
            <Avatar sx={{ bgcolor: "primary.main", marginBottom: 2 }}>
              {currentUser.name.charAt(0).toUpperCase()}
            </Avatar>
            <List>
              {links.map((link) => (
                <ListItem component="a" href={link.href} key={link.name}>
                  <ListItemText primary={link.name} />
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
