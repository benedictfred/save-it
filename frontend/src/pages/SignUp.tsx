import SignUpForm from "../components/SignUpForm";

export default function SignUp() {
  return (
    <section className="flex flex-col justify-center items-center h-screen space-y-10">
      <div className="flex flex-col justify-center items-center space-y-5">
        <h1 className="text-3xl font-bold text-primary">Save It</h1>
        <p className="text-white text-xl">Welcome</p>
        <p className="text-white">
          Register to effortlessly save, receive, and send money using only your
          phone number.
        </p>
      </div>
      <SignUpForm />
    </section>
  );
}
