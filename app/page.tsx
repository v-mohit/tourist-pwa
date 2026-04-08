import Home from '@/features/home/Home';
import { FetchHomeDataDocument, FetchTopPackageDocument } from '@/generated/graphql';
import { graphqlClient } from '@/services/client';

export const revalidate = 60;

export default async function Page() {
  const data = await graphqlClient.request(FetchHomeDataDocument);
  const topPackageData =  await graphqlClient.request(FetchTopPackageDocument);

  return <Home data={data} topPackageData={topPackageData} />;
}