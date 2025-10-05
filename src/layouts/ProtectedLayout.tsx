import { Box, CircularProgress, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SIDEBAR_ITEMS from "../data/layout.data";
import Footer from "../views/Footer";
import ImgContainer from "../components/ImgContainer";
import { Logout, Person } from "@mui/icons-material";
import { ApiController, ApiStatus } from "../api";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";
import ProfileModal from "../models/ProfileModal";

function ProtectedLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const drawerWidth = 350;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profileDetails, setProfileDetails] = useState<Record<string, any>>();
  const [profileDialogView, setProfileDialogView] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  async function logout(): Promise<void> {
    const authorization = `Bearer ${localStorage.getItem("authorization") as string
      }`;
    const token = localStorage.getItem("token") as string;

    try {
      const controller = new ApiController();
      const reply = await controller.logout("authentication/logout", {
        authorization,
        token,
      });


      if (reply.status === ApiStatus.SUCCESS) {
        localStorage.clear();
        toast.success(reply.message, getGlobalToastConfig());
        navigate("/auth/login");
      } else {
        toast.error(reply.message, getGlobalToastConfig());
      }
    } catch (error: any) {
      const message = error?.message || "Something went wrong while processing your request, please try again!!!";
      toast.error(message, getGlobalToastConfig());
    }
    finally {
      setIsLoading(false);
    }
  }

  async function fetchProfile(): Promise<void> {
    const token = localStorage.getItem("authorization") as string;
    const authorization = `Bearer ${token}`;

    try {
      const controller = new ApiController();
      const reply = await controller.GET("user/profile", authorization);


      if (reply.status === ApiStatus.SUCCESS) {
        setProfileDetails(reply.data);
        setProfileDialogView(true);
      } else {
        toast.error(reply.message, getGlobalToastConfig());
      }
    } catch (error: any) {
      const message = error?.message || "Something went wrong while processing your request, please try again!!!";
      toast.error(message, getGlobalToastConfig());
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleLogoutBtnClick = useCallback(async function () {
    setIsLoading(true);
    await logout();
  }, []);

  const handleProfileBtnClick = useCallback(async function () {
    setIsLoading(true);
    await fetchProfile();
  }, []);

  const DrawerItems = (
    <div>
      <List>
        {SIDEBAR_ITEMS.map((text) => (
          <ListItem key={text.url} disablePadding>
            <ListItemButton href={text.url}>
              <ListItemIcon>
                <text.Icon />
              </ListItemIcon>
              <ListItemText primary={text.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <Box component="div" className="flex flex-col min-h-screen">
        <Box component="header" className="flex justify-between items-center min-h-[4vh]">
          <Box component="div" className="max-w-max p-1 mx-1">
            <Typography variant={!isMobile ? "h4" : "h5"} fontWeight={900} className="text-center" color="warning">Coding Works</Typography>

            <Divider className="bg-blue-800 font-black h-1" />

            <Typography variant={!isMobile ? "h6" : "body1"} fontWeight={900} className="text-center" color="success">Portfolio Services</Typography>
          </Box>

          <Box component="div" sx={{ display: "flex", alignItems: "center", p: 1 }}>
            <ImgContainer url="/logo.jpeg" />
          </Box>
        </Box>

        <Box component="div" sx={{ display: "flex", gap: 1, px: 1, alignItems: "center", justifyContent: "space-between" }}>
          <Box component="div" className="flex items-center">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" fontWeight={900} className="text-blue-800">Portfolio CMS</Typography>
          </Box>

          <Box component="div">
            <IconButton
              sx={{ backgroundColor: '#ea580c', color: "white", "&:hover": { color: "#ea580c" } }}
              id="account-menu"
              aria-controls={open ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}>
              <Person fontSize="small" color="inherit" />
            </IconButton>

            <Menu
              id="account-menu"
              aria-labelledby="account-menu-label"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem>
                <List>
                  <ListItemButton onClick={handleProfileBtnClick} disabled={isLoading}>
                    <ListItemIcon>
                      {!isLoading ? <Person /> : <CircularProgress size={16} color="secondary" />}
                    </ListItemIcon>

                    <ListItemText>Profile</ListItemText>
                  </ListItemButton>
                </List>
              </MenuItem>

              <MenuItem>
                <List>
                  <ListItemButton onClick={handleLogoutBtnClick} disabled={isLoading}>
                    <ListItemIcon>
                      {!isLoading ? <Logout /> : <CircularProgress size={16} color="secondary" />}
                    </ListItemIcon>

                    <ListItemText>Logout</ListItemText>
                  </ListItemButton>
                </List>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Box component="main" sx={{ display: "flex", flexGrow: 1 }}>
          <Box
            component="aside"
            sx={{
              width: { sm: `${drawerWidth}px` },
              borderRight: { md: '1px solid gainsboro', xs: "none" },
              mr: 1,
              position: "relative"
            }}>

            <Drawer
              variant="temporary"
              open={mobileOpen}
              onTransitionEnd={handleDrawerTransitionEnd}
              onClose={handleDrawerClose}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', },
              }}
              slotProps={{
                root: {
                  keepMounted: true,
                },
              }}
            >
              <Toolbar />
              <Divider />
              {DrawerItems}
            </Drawer>

            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block', },
                '& .MuiDrawer-paper': {
                  position: 'relative',
                  boxSizing: 'border-box',
                  border: 'none',
                },
              }}
              open
            >
              {DrawerItems}
            </Drawer>
          </Box>

          <Box component="div" sx={{ width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` } }}>
            <Outlet />
          </Box>
        </Box>

        <Box component="footer" sx={{ display: "flex", flexShrink: 0 }}>
          <Footer />
        </Box>
      </Box>

      {
        profileDialogView &&
        <ProfileModal
          details={profileDetails}
          handleDialogCloseBtnClick={() => setProfileDialogView(false)}
          open={profileDialogView}
          text="Profile Details"
        />
      }
    </>
  );
}

export default ProtectedLayout;