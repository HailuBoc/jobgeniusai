import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="text-center">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          My Cover Letters
        </h1>
        <p className="text-muted-foreground mb-6">
          Manage your generated cover letters
        </p>
        <Link href="/ai-cover-letter/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}
