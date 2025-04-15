import { toast } from "react-toastify";
import { useAccount } from "../contexts/AccountContext";
import { truncateName } from "../utils/helpers";
import { IoMdNotifications, IoCopyOutline } from "../utils/icons";

export default function Header() {
  const { user } = useAccount();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(user?.phoneNumber as string)
      .then(() => {
        toast.success("Account copied successfully");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <header className="flex justify-between items-center px-3 py-5 shadow-lg border-b border-gray-700">
      <div>
        <h1 className="text-xl font-bold text-primary">Save It</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col space-y-1 items-start">
            <p>{truncateName(user?.name as string)}</p>
            <p className="flex space-x-2 items-center text-sm text-gray-300">
              <span>{user?.phoneNumber}</span>{" "}
              <span>
                <IoCopyOutline
                  className="cursor-pointer"
                  onClick={handleCopy}
                />
              </span>
            </p>
          </div>
          <img src="/profile.png" alt="profile-image" />
        </div>
        <IoMdNotifications size={30} />
      </div>
    </header>
  );
}
