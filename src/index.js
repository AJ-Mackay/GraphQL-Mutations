import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useLazyQuery,
  gql,
} from '@apollo/client';

import './index.css';

const client = new ApolloClient({
  uri: 'https://71z1g.sse.codesandbox.io',
  cache: new InMemoryCache(),
});

const GET_DOGS = gql`
  query GetDogs {
    dogs {
      id
      breed
    }
  }
`;

function Dogs({ onDogSelected }) {
  // const { loading, error, data } = useQuery(GET_DOGS);
  const { loading, error, data } = useQuery(GET_DOGS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <select name="dog" onChange={onDogSelected}>
      {data.dogs.map((dog) => (
        <option key={dog.id} value={dog.breed}>
          {dog.breed}
        </option>
      ))}
    </select>
  );
}

const GET_DOG_PHOTO = gql`
  query Dog($breed: String!) {
    dog(breed: $breed) {
      id
      displayImage
    }
  }
`;

// function DogPhoto({ breed }) {
//   const { loading, error, data, refetch, networkStatus } = useQuery(
//     GET_DOG_PHOTO,
//     {
//       variables: { breed },
//       notifyOnNetworkStatusChange: true,
//     }
//   );

//   if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
//   if (loading) return null;
//   if (error) return `Error! ${error}`;

//   return (
//     <div>
//       <img
//         alt="dog"
//         src={data.dog.displayImage}
//         style={{ height: 100, width: 100 }}
//       />
//       <button
//         onClick={() =>
//           refetch({
//             breed: 'dalmation',
//           })
//         }
//       >
//         Refetch!
//       </button>
//     </div>
//   );
// }

function DelayedQuery() {
  const [getDog, { loading, error, data }] = useLazyQuery(GET_DOG_PHOTO);

  if (loading) return <p>Loading...</p>;
  if (error) return `Error! ${error}`;

  return (
    <div>
      {data?.dog && <img alt="dog" src={data.dog.displayImage} />}
      <button onClick={() => getDog({ variables: { breed: 'bulldog' } })}>
        Click me!
      </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>My first Apollo Fetch Query app</h2>
      <Dogs />
      <DelayedQuery />
    </div>
  );
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
