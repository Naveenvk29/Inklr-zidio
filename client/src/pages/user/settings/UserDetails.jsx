import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../../../redux/features/authSlice";

const UserDetails = ({ profile, updateUser }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.fullName.firstName || "");
      setLastName(profile.fullName.lastName || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedInfo = {
      fullName: {
        firstName,
        lastName,
      },
      email,
    };

    try {
      const result = await updateUser(updatedInfo).unwrap();
      dispatch(updateUserInfo(result));
      toast.success("User details updated!");
    } catch (error) {
      toast.error("Failed to update user details.");
      console.error(error);
      console.log(error);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-lg bg-neutral-100 p-8 shadow-md dark:bg-neutral-800">
      <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-300">
        User Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-300">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-500 px-4 py-2 text-neutral-900 focus:border-neutral-200 focus:ring focus:outline-none dark:text-neutral-100"
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-300">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-500 px-4 py-2 text-neutral-900 focus:border-neutral-200 focus:ring focus:outline-none dark:text-neutral-200"
            placeholder="Enter last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-500 px-4 py-2 text-neutral-900 focus:border-neutral-200 focus:ring focus:outline-none dark:text-neutral-200"
            placeholder="Enter email address"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetails;
