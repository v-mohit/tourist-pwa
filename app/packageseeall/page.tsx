import PackageSeeAll from "@/features/packages-see-all/PackageSeeAll";
import {
  FetchTopPackageDocument,
} from "@/generated/graphql";
import { graphqlClient } from "@/services/client";

export const revalidate = 60;

export default async function Page() {
  const topPackageData = await graphqlClient.request(FetchTopPackageDocument, {});

  return <PackageSeeAll packageData={topPackageData} />;
}
