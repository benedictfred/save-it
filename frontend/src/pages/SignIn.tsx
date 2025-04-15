import LoginForm from "../components/LoginForm";

export default function SignIn() {
  return (
    <section className="flex flex-col justify-center items-center h-screen space-y-10">
      <div className="flex flex-col justify-center items-center space-y-5">
        <h1 className="text-3xl font-bold text-primary">Save It</h1>
        <p className="text-white text-xl">Welcome Back</p>
        <p className="text-white max-md:text-center">
          Sign in to effortlessly save, receive, and send money using only your
          phone number.
        </p>
      </div>
      <LoginForm />
    </section>
  );
}
