import { FetchDepartmentDataDocument } from "@/generated/graphql";
import { graphqlClient } from "@/services/client";
import AsiSeeAll from "@/features/asi-see-all/AsiSeeAll";

export default async function Page() {
  const departmentData = await graphqlClient.request(FetchDepartmentDataDocument);
  
  const asiDept = departmentData?.departments?.data?.find(
    (dept: any) => dept?.attributes?.Name === "Archaeological Survey of India"
  );

  return <AsiSeeAll data={asiDept?.attributes} />;
}
