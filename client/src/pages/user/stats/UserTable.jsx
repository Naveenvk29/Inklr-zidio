import { Link } from "react-router-dom";

const UserTable = ({ users }) => {
  if (users.length === 0) return <p>No users found.</p>;

  return (
    <div className="overflow-x-auto rounded bg-white shadow dark:bg-neutral-700">
      <table className="w-full text-left">
        <thead className="bg-neutral-100 dark:bg-neutral-800">
          <tr>
            <th className="p-3">Avatar</th>
            <th className="p-3">Username</th>
            <th className="p-3">Full Name</th>
            <th className="p-3">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-b hover:bg-neutral-50 dark:hover:bg-neutral-600"
            >
              <td className="p-3">
                <Link to={`/user-profile/${user._id}`}>
                  <img
                    src={user.avatar.url}
                    alt="avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </Link>
              </td>
              <td className="p-3 font-medium">
                <Link
                  to={`/user-profile/${user._id}`}
                  className="hover:underline"
                >
                  {user.userName}
                </Link>
              </td>
              <td className="p-3 text-sm">
                <Link
                  to={`/user-profile/${user._id}`}
                  className="hover:underline"
                >
                  {user.fullName?.firstName} {user.fullName?.lastName}
                </Link>
              </td>
              <td className="p-3 text-sm text-neutral-400">
                <Link
                  to={`/user-profile/${user._id}`}
                  className="hover:underline"
                >
                  {user.email}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
