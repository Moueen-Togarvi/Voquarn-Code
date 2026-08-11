import { getJobOpenings } from "@/lib/data";
import { JsonLd } from "@/components/seo/json-ld";
import { jobPostingJsonLd } from "@/lib/schema";
import { CareersClient } from "./careers-client";

export default async function CareersPage() {
  const jobs = await getJobOpenings();
  return (
    <>
      {jobs.length > 0 && <JsonLd data={jobs.map(jobPostingJsonLd)} />}
      <CareersClient jobs={jobs} />
    </>
  );
}
