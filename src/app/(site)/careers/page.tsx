import { getJobOpenings } from "@/lib/data";
import { CareersClient } from "./careers-client";

export default async function CareersPage() {
  const jobs = await getJobOpenings();
  return <CareersClient jobs={jobs} />;
}
