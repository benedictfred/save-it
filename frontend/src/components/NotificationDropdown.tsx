import { Notification } from "../utils/types";

export default function NotificationDropdown({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <div className="absolute max-sm:-right-10 right-0 top-12 w-72 bg-black border border-gray-700 rounded-lg shadow-lg z-50">
      <div className="p-3 border-b border-b-gray-700 font-semibold text-gray-100">
        Notifications
      </div>
      <ul className="divide-y divide-gray-700 max-h-64 overflow-y-auto">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="px-4 py-3 hover:bg-gray-700 text-sm text-gray-100"
          >
            <span className="flex flex-col">
              <span className="font-semibold text-base space-y-1">
                {notification.title}
              </span>
              <span>{notification.body}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="text-sm text-center text-primary hover:underline cursor-pointer p-2">
        View all
      </div>
    </div>
  );
}
