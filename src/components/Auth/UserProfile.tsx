// src/components/Auth/UserProfile.tsx
import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import { useAuthContext } from '@/hooks/useAuthContext';

/**
 * User profile menu component that shows user information and provides logout functionality.
 */
const UserProfile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Handle menu open
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    handleClose();
    logout();
  };

  // If not authenticated, don't render anything
  if (!isAuthenticated || !user) {
    return null;
  }

  // Extract user information
  const name = user.profile?.name || user.profile?.preferred_username || 'User';
  const email = user.profile?.email || '';
  const picture = user.profile?.picture || '';

  return (
    <>
      <Tooltip title="Account Settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {picture ? (
            <Avatar sx={{ width: 32, height: 32 }} src={picture} />
          ) : (
            <AccountCircleIcon />
          )}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1">{name}</Typography>
          {email && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {email}
            </Typography>
          )}
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleClose}>
          <PersonIcon sx={{ mr: 1.5 }} /> Profile
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <ExitToAppIcon sx={{ mr: 1.5 }} /> Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfile;