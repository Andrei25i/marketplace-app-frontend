import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, Button, Menu } from "@mantine/core";
import { Link } from "react-router-dom";

const UserAvatar = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return (
      <Button variant="outline" color="primary" component={Link} to="/login">
        Log In
      </Button>
    );
  }

  return (
    <Menu trigger="hover" openDelay={100} closeDelay={100} withinPortal>
      <Avatar component={Link} to="/profile" color="primary" radius="xl">
        {user?.first_name[0]}
        {user?.last_name[0]}
      </Avatar>
    </Menu>
  );
};

export default UserAvatar;
