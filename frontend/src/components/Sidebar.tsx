import { NavLink } from "react-router-dom";
import { FaHistory, FaHome, MdCallMade, MdCallReceived } from "../utils/icons";

export default function Sidebar() {
  return (
    <nav className="h-screen w-[23%] px-3 py-16 border-r border-gray-900 bg-gradient-to-b from-black to-gray-900 ">
      <ul className="flex flex-col space-y-7">
        <NavLink to="/home" className={`flex items-center space-x-2`}>
          <span>
            <FaHome size={25} />
          </span>
          <span>Home</span>
        </NavLink>

        <NavLink to="/deposit" className={`flex items-center space-x-2`}>
          <span>
            <MdCallReceived size={25} />
          </span>
          <span>Deposit</span>
        </NavLink>

        <NavLink to="/transfer" className={`flex items-center space-x-2`}>
          <span>
            <MdCallMade size={25} />
          </span>
          <span>Transfer</span>
        </NavLink>

        <NavLink to="/history" className={`flex items-center space-x-2`}>
          <span>
            <FaHistory size={25} />
          </span>
          <span>History</span>
        </NavLink>

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
