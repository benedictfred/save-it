import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-5">
      <h1 className="text-3xl">404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p className="space-x-1">
        <span>Go back to</span>
        <Link
          to="/home"
          className="bg-primary text-black py-1 px-2 rounded-full"
        >
          home
        </Link>
      </p>
    </div>
  );
}
