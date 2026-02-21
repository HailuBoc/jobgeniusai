import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>
        <h1 className="font-bold gradient-title text-5xl md:text-6xl mt-2">
          {coverLetter?.jobTitle} at {coverLetter?.companyName}
        </h1>
        <p className="text-muted-foreground">
          Cover letter preview and management
        </p>
      </div>

      <CoverLetterPreview content={coverLetter?.content} />
    </div>
  );
}
