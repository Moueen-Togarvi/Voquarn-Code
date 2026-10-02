import { getJobOpenings } from "@/lib/data";
import { CareersClient } from "./careers-client";

// Regenerated hourly so admin edits to job openings reach the live site
// without a redeploy.
export const revalidate = 3600;

export default async function CareersPage() {
  const jobs = await getJobOpenings();
  return (
    <>
      {/* JobPosting requires individual job URLs and real posting dates. */}
      <CareersClient jobs={jobs} />
    </>
  );
}
