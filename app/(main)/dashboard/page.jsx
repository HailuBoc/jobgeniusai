import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect to onboarding page
  // Skip this check if already on the onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const insights = await getIndustryInsights();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="text-center">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Industry insights and career analytics
        </p>
      </div>
      <DashboardView insights={insights} />
    </div>
  );
}
