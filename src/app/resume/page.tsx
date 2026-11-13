import type { Metadata } from "next";
import { ResumeDocument } from "@/components/resume/resume-document";
import { ResumeSwitcher } from "@/components/resume/resume-switcher";
import { resumeVariants } from "@/data/resume";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Web résumé with role-specific emphasis for AI, ML, data engineering, data science, MLOps and analytics roles — downloadable as PDF.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  const variants = resumeVariants.map((v) => ({ id: v.id, label: v.label, file: v.file, node: <ResumeDocument v={v} /> }));
  return (
    <div className="pt-32 pb-24 sm:pt-40 print:p-0">
      <div className="container-page max-w-[960px] print:max-w-none print:px-0">
        <div className="no-print mb-10">
          <p className="eyebrow mb-5">Résumé</p>
          <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.04] font-semibold tracking-[-0.04em]">One page, six emphases.</h1>
          <p className="lede mt-4 max-w-2xl">
            Same facts, different order. Pick the role you&apos;re hiring for — the PDF is generated from this exact page.
          </p>
        </div>
        <ResumeSwitcher variants={variants} />
      </div>
    </div>
  );
}
