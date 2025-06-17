import { ApolloClient,InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
    uri: `${import.meta.env.BASE_URL}/graphql`,
    credentials: 'include', 
  });
  
  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  export default client
  