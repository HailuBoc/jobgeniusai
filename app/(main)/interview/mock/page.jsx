import React from "react";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";

export default function MockInterviewPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="text-center">
        <Link href="/interview">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          </Button>
        </Link>

        <h1 className="font-bold gradient-title text-5xl md:text-6xl mt-2">
          Mock Interview
        </h1>
        <p className="text-muted-foreground">
          Test your knowledge with industry-specific questions
        </p>
      </div>

      <Quiz />
    </div>
  );
}
