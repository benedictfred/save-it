import { toast } from "react-toastify";
import { truncateName } from "../utils/helpers";
import { IoMdNotifications, IoCopyOutline } from "../utils/icons";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

export default function Header() {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(user?.accountNumber as string)
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
              <span>{user?.accountNumber}</span>{" "}
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
        <div className="flex items-center space-x-4">
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-primary transition"
              aria-label="Notifications"
              onClick={() => setNotifOpen((prev) => !prev)}
            >
              <IoMdNotifications size={30} />
              <span
                className={`absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ${
                  user!.recentNotifications!.filter((notif) => !notif.read)
                    .length > 0
                    ? "block"
                    : "hidden"
                }`}
              >
                {
                  user?.recentNotifications?.filter((notif) => !notif.read)
                    .length
                }
              </span>
            </button>

            {notifOpen && (
              <NotificationDropdown
                notifications={user?.recentNotifications ?? []}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
