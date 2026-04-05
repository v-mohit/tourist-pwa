'use server'
import Home from '@/features/home/Home';
import { FetchHomeDataDocument } from '@/generated/graphql';
import { graphqlClient } from '@/services/client';

export default async function Page() {
  const data = await graphqlClient.request(FetchHomeDataDocument);
console.log("data----",data);

  return <Home homeData={data}/>;
}
