import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk";

const Page = () => {
  if (!isClerkConfigured) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        Sign-up is disabled until Clerk environment keys are configured.
      </div>
    );
  }

  return <SignUp />;
};

export default Page;
