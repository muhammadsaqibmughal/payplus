import { ThemeBackground } from "@/components/ThemeBackground";
import { LandingExperience } from "@/components/landing/LandingExperience";

export default function HomePage() {
  return (
    <>
      <ThemeBackground variant="main" dim={0.3} />
      <LandingExperience />
    </>
  );
}
