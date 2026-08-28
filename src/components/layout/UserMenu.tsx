import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, Button, Menu } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

const UserMenu = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return (
      <Button variant="outline" color="primary" component={Link} to="/login">
        Log In
      </Button>
    );
  }

  return (
    <Menu trigger="hover" openDelay={100} closeDelay={300} withinPortal>
      <Menu.Target>
        <Avatar component={Link} to="/profile" color="primary" radius="xl">
          {user?.first_name[0]}
          {user?.last_name[0]}
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          color="red"
          leftSection={<IconLogout size={14} />}
          onClick={handleLogout}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
