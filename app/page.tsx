import {
  FetchHomeDataDocument,
  FetchDestinationDocument,
  FetchTopPackageDocument,
  FetchCategoriesCountsDocument,
  FetchUpcomingEventsDocument,
  FetchPlaceDetailsDocument,
} from "@/generated/graphql";
import { graphqlClient } from "@/services/client";
import Home from "@/features/home/Home";

export const revalidate = 60;

export default async function Page() {
  const data = await graphqlClient.request(FetchHomeDataDocument);
  const cityData = await graphqlClient.request(FetchDestinationDocument, {});
  const topPackageData = await graphqlClient.request(FetchTopPackageDocument);
  const categoryCountsData = await graphqlClient.request(
    FetchCategoriesCountsDocument,
  );
  const upcomingEventsData = await graphqlClient.request(
    FetchUpcomingEventsDocument,
  );
  const JkkplaceDetailsData = await graphqlClient.request(
    FetchPlaceDetailsDocument,
    { slug: "JAWAHAR-KALA-KENDRA" },
  );

  const props = {
    data,
    cityData,
    topPackageData,
    categoryCountsData,
    upcomingEventsData,
    JkkplaceDetailsData,
  };
  return <Home {...props} />;
}
