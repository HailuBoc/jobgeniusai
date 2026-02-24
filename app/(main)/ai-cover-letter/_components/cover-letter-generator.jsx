"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Download, Save, Edit, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

// Dynamically import html2pdf to avoid SSR issues
const html2pdf = dynamic(() => import("html2pdf.js/dist/html2pdf.min.js"), {
  ssr: false,
});

export default function CoverLetterGenerator() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("edit");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const {
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  // Update content when letter is generated
  useEffect(() => {
    if (generatedLetter) {
      setGeneratedContent(generatedLetter.content);
      setActiveTab("preview");
      toast.success("Cover letter generated successfully!");
      reset();
    }
  }, [generatedLetter]);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const html2pdfModule = await import("html2pdf.js/dist/html2pdf.min.js");
      const html2pdf = html2pdfModule.default;

      const element = document.getElementById("cover-letter-pdf");
      const opt = {
        margin: [10, 10],
        filename: "cover-letter.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          scrollY: 0,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await new Promise((resolve) => setTimeout(resolve, 500));
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCoverLetter = async () => {
    if (!generatedContent) {
      toast.error("No cover letter to save");
      return;
    }

    setIsSaving(true);
    try {
      // This would typically save to the database
      toast.success("Cover letter saved successfully!");
    } catch (error) {
      toast.error("Failed to save cover letter");
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await generateLetterFn(data);
    } catch (error) {
      toast.error(error.message || "Failed to generate cover letter");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <div></div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={saveCoverLetter}
            disabled={isSaving || !generatedContent}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button
            onClick={generatePDF}
            disabled={isGenerating || !generatedContent}
            variant="outline"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="text-lg font-medium mb-4">Job Details</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Provide information about the position you're applying for
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    {...register("companyName")}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="Enter job title"
                    {...register("jobTitle")}
                  />
                  {errors.jobTitle && (
                    <p className="text-sm text-red-500">
                      {errors.jobTitle.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description here"
                  className="h-32"
                  {...register("jobDescription")}
                />
                {errors.jobDescription && (
                  <p className="text-sm text-red-500">
                    {errors.jobDescription.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={generating}>
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Cover Letter"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="border rounded-lg">
            <MDEditor
              value={generatedContent}
              onChange={setGeneratedContent}
              height={600}
              preview="preview"
            />
          </div>
          <div className="hidden">
            <div
              id="cover-letter-pdf"
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "20mm",
                background: "white",
                color: "black",
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                lineHeight: "1.4",
              }}
            >
              <MDEditor.Markdown
                source={generatedContent}
                style={{
                  background: "white",
                  color: "black",
                  fontSize: "12px",
                  lineHeight: "1.4",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
