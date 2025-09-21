import SignUpForm from "../components/SignUpForm";

export default function SignUp() {
  return (
    <section className="flex flex-col justify-center items-center min-h-screen py-10 space-y-10">
      <div className="flex flex-col justify-center items-center space-y-5">
        <h1 className="text-3xl font-bold text-primary">Save It</h1>
        <p className="text-white text-xl">Welcome</p>
        <p className="text-white max-md:text-center">
          Register to effortlessly save, receive, and send money.
        </p>
      </div>
      <SignUpForm />
    </section>
  );
}
