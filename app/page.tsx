import {
  FetchHomeDataDocument,
  FetchDestinationDocument,
  FetchTopPackageDocument
} from "@/generated/graphql";
import { graphqlClient } from "@/services/client";
import Home from '@/features/home/Home';

export const revalidate = 60;

export default async function Page() {
  const data = await graphqlClient.request(FetchHomeDataDocument);
  const cityData = await graphqlClient.request(FetchDestinationDocument);
  const topPackageData = await graphqlClient.request(FetchTopPackageDocument);

  return <Home data={data} cityData={cityData} topPackageData={topPackageData} />;
}
