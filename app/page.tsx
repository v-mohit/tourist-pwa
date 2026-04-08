import {
  FetchHomeDataDocument,
  FetchDestinationDocument,
  FetchTopPackageDocument,
  FetchCategoriesCountsDocument
} from "@/generated/graphql";
import { graphqlClient } from "@/services/client";
import Home from '@/features/home/Home';

export const revalidate = 60;

export default async function Page() {
  const data = await graphqlClient.request(FetchHomeDataDocument);
  const cityData = await graphqlClient.request(FetchDestinationDocument);
  const topPackageData = await graphqlClient.request(FetchTopPackageDocument);
  const categoryCountsData = await graphqlClient.request(FetchCategoriesCountsDocument);

  return <Home data={data} cityData={cityData} topPackageData={topPackageData} categoryCountsData={categoryCountsData} />;
}
