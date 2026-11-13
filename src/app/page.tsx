import { Hero } from "@/components/home/hero";
import { SelectedEngineering } from "@/components/home/selected-engineering";
import {
  ContactCTA,
  Credibility,
  EducationSection,
  Experience,
  Philosophy,
  Recognition,
  ResearchPreview,
  Skills,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Credibility />
      <SelectedEngineering />
      <Philosophy />
      <Experience />
      <Skills />
      <ResearchPreview />
      <Recognition />
      <EducationSection />
      <ContactCTA />
    </>
  );
}
