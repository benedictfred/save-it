import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <section className="flex h-screen max-md:no-scrollbar">
      <Sidebar />
      <div className="flex flex-col w-full max-md:pb-20">
        <Header />
        <Outlet />
      </div>
    </section>
  );
}
