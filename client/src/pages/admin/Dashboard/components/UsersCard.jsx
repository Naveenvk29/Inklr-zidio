import { useGetAllUserQuery } from "../../../../redux/api/userApi";
import {
  useFetchBannedUsersQuery,
  useBanUserMutation,
  useDeleteUserMutation,
  useModifyUserRoleMutation,
} from "../../../../redux/api/adminApi";
import { useState } from "react";
import UserRowCard from "./UserRowCard";

const UsersCard = () => {
  const { data: users, isLoading } = useGetAllUserQuery();
  const { data: bannedUsers } = useFetchBannedUsersQuery();
  const [banUser] = useBanUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [modifyUserRole] = useModifyUserRoleMutation();

  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <p className="text-neutral-500">Loading users...</p>;
  if (!users || users.length === 0)
    return <p className="text-neutral-500">No users found</p>;

  const filteredUsers = users.filter((user) => {
    const userName = user?.userName || "";
    const firstName = user?.fullName?.firstName || "";
    const lastName = user?.fullName?.lastName || "";

    return (
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleBan = async (id) => {
    await banUser(id);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    await modifyUserRole({ id: user._id, role: newRole });
  };

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-xl font-semibold text-neutral-800 dark:text-white">
        All Users
      </h2>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
      />
      {filteredUsers.map((user) => {
        const isBanned = bannedUsers?.some((u) => u._id === user._id);
        return (
          <UserRowCard
            key={user._id}
            user={user}
            isBanned={isBanned}
            onBan={handleBan}
            onDelete={handleDelete}
            onRoleToggle={handleRoleToggle}
          />
        );
      })}
    </div>
  );
};

export default UsersCard;
