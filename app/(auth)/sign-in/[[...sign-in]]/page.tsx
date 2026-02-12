import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col-reverse md:flex-row">
      {/* Left side - Sign In */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 md:w-1/2 md:p-8 gap-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <SignIn />
        </div>
      </div>

      {/* Right side */}
      <div className="w-full bg-accent md:w-1/2" />
    </div>
  );
}