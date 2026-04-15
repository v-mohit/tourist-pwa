import ExploreSeeAll from "@/features/explore-see-all/ExploreSeeAll";
import {
  FetchDestinationDocument,
} from "@/generated/graphql";
import { graphqlClient } from "@/services/client";

export const revalidate = 60;

export default async function Page() {
  const cityData = await graphqlClient.request(FetchDestinationDocument, {});

  return <ExploreSeeAll cityData={cityData} />;
}
