import Home from '@/features/home/Home';
import { FetchHomeDataDocument } from '@/generated/graphql';
import { graphqlClient } from '@/services/client';

export const revalidate = 60;

export default async function Page() {
  const data = await graphqlClient.request(FetchHomeDataDocument);

  return <Home data={data}/>;
}