import { Outlet } from "react-router-dom";

export default function Transfer() {
  return (
    <section className="w-full p-5 overflow-y-auto">
      <p>Send Money</p>
      <div className="flex flex-col space-y-3 justify-center items-center py-7">
        <Outlet />
      </div>
    </section>
  );
}
