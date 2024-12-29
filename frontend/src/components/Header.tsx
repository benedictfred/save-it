import { useAccount } from "../contexts/AccountContext";
import { truncateName } from "../utils/helpers";
import { IoMdNotifications } from "../utils/icons";

export default function Header() {
  const { user } = useAccount();
  return (
    <header className="flex justify-between items-center px-3 py-5 shadow-lg border-b border-gray-700">
      <div>
        <h1 className="text-xl font-bold text-primary">Save It</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <p>{truncateName(user?.name as string)}</p>
          <img src="/profile.png" alt="profile-image" />
        </div>
        <IoMdNotifications size={30} />
      </div>
    </header>
  );
}
