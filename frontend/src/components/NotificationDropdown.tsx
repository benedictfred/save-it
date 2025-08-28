import { useAuth } from "../contexts/AuthContext";
import { markAllAsRead } from "../services/notificationService";
import { Notification } from "../utils/types";

export default function NotificationDropdown({
  notifications,
}: {
  notifications: Notification[];
}) {
  const { fetchUser } = useAuth();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await fetchUser();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="absolute right-0 top-12 w-72 bg-black border border-gray-700 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center p-3 border-b border-b-gray-700 font-semibold text-gray-100">
        <p>Notifications</p>
        <button
          className="border border-gray-700 px-2 py-1 rounded-lg text-sm text-gray-400 hover:text-gray-100"
          onClick={handleMarkAllAsRead}
        >
          Mark all as read
        </button>
      </div>
      <ul className="relative divide-y divide-gray-700 max-h-64 overflow-y-auto">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="px-4 py-3 hover:bg-gray-700 text-sm text-gray-100 flex items-start gap-2"
          >
            {!notification.read && (
              <span className="absolute right-5 w-2 h-2 mt-2 p-1 rounded-full bg-primary"></span>
            )}
            <span className="flex flex-col">
              <span className="font-semibold text-base">
                {notification.title}
              </span>
              <span>{notification.body}</span>
            </span>
          </li>
        ))}
        <li className="px-4 py-3 hover:bg-gray-700 text-sm text-gray-100">
          {notifications.length === 0 && <span>No new notifications</span>}
        </li>
      </ul>
      <div className="text-sm text-center text-primary hover:underline cursor-pointer p-2">
        View all
      </div>
    </div>
  );
}
