import {
  FetchHomeDataDocument,
  FetchDestinationDocument,
  FetchTopPackageDocument,
  FetchCategoriesCountsDocument,
  FetchUpcomingEventsDocument,
  FetchPlaceDetailsDocument,
  FetchDepartmentDataDocument,
} from "@/generated/graphql";
import { graphqlClient } from "@/services/client";
import Home from "@/features/home/Home";

export const revalidate = 60;

export default async function Page() {
  const [
    data,
    cityData,
    topPackageData,
    categoryCountsData,
    upcomingEventsData,
    JkkplaceDetailsData,
    departmentData,
  ] = await Promise.all([
    graphqlClient.request(FetchHomeDataDocument, {}),
    graphqlClient.request(FetchDestinationDocument, {}),
    graphqlClient.request(FetchTopPackageDocument, {}),
    graphqlClient.request(FetchCategoriesCountsDocument, {}),
    graphqlClient.request(FetchUpcomingEventsDocument, {}),
    graphqlClient.request(FetchPlaceDetailsDocument, {
      slug: "JAWAHAR-KALA-KENDRA",
    }),
    graphqlClient.request(FetchDepartmentDataDocument, {}),
  ]);

console.log("data >>>>>>>>>>",departmentData);


  const props = {
    data,
    cityData,
    topPackageData,
    categoryCountsData,
    upcomingEventsData,
    JkkplaceDetailsData,
    departmentData,
  };
  return <Home {...props} />;
}
