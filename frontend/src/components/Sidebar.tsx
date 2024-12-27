import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHistory,
  FaHome,
  MdCallMade,
  MdCallReceived,
  LuLogOut,
} from "../utils/icons";

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogOut() {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("expiry");
    navigate("/sign-in");
  }
  return (
    <nav className="h-screen w-[23%] max-sm:px-4 md:px-16 lg:px-3 py-16 border-r border-gray-900 lg:bg-gradient-to-b lg:from-black lg:to-gray-900 max-md:fixed max-md:bottom-0 max-md:w-full max-md:h-20 max-md:py-0">
      <ul className="flex flex-col space-y-7 max-md:flex-row max-md:justify-between max-md:items-center max-md:space-y-0 max-md:space-x-2 max-md:backdrop-blur-xl max-md:h-20 max-md:z-50 max-md:border-none max-md:rounded-t-xl">
        <NavLink
          to="/home"
          className="flex items-center space-x-2 max-md:flex-col"
        >
          <span>
            <FaHome size={25} />
          </span>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/deposit"
          className="flex items-center space-x-2 max-md:flex-col"
        >
          <span>
            <MdCallReceived size={25} />
          </span>
          <span>Deposit</span>
        </NavLink>

        <NavLink
          to="/transfer"
          className="flex items-center space-x-2 max-md:flex-col"
        >
          <span>
            <MdCallMade size={25} />
          </span>
          <span>Transfer</span>
        </NavLink>

        <NavLink
          to="/history"
          className="flex items-center space-x-2 max-md:flex-col"
        >
          <span>
            <FaHistory size={25} />
          </span>
          <span>History</span>
        </NavLink>

        <li
          className="flex items-center space-x-2 cursor-pointer text-red-500 max-md:flex-col"
          onClick={handleLogOut}
        >
          <span>
            <LuLogOut size={25} />
          </span>
          <span>Logout</span>
        </li>

        {/* <a
          href="https://www.flaticon.com/free-icons/mobile-banking"
          title="mobile-banking icons"
        >
          Mobile-banking icons created by Andrean Prabowo - Flaticon
        </a> */}
      </ul>
    </nav>
  );
}
