"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Dynamically import CoverLetterGenerator to avoid SSR issues
const CoverLetterGenerator = dynamic(
  () => import("../_components/cover-letter-generator"),
  {
    ssr: false,
  },
);

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function NewCoverLetterPage() {
  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="text-center">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>
        <h1 className="font-bold gradient-title text-5xl md:text-6xl mt-2">
          Create Cover Letter
        </h1>
        <p className="text-muted-foreground">
          Generate a tailored cover letter for your job application
        </p>
      </div>
      <CoverLetterGenerator />
    </div>
  );
}
