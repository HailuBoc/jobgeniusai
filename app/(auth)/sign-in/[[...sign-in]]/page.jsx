import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk";

const Page = () => {
  if (!isClerkConfigured) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        Sign-in is disabled until Clerk environment keys are configured.
      </div>
    );
  }

  return <SignIn />;
};

export default Page;
