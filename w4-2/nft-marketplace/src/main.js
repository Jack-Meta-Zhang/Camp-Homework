// import { createApp, h } from "vue";
// import App from "./App.vue";

// import "./assets/main.css";

// import { ApolloClient, InMemoryCache } from "@apollo/client/core";
// import { createApolloProvider } from "@vue/apollo-option";
// import { provideApolloClient } from "@vue/apollo-composable";

// const cache = new InMemoryCache();
// const apolloClient = new ApolloClient({
//   cache,
//   uri: "https://api.thegraph.com/subgraphs/name/jack-meta-zhang/feinft",
// });
// // const apolloProvider = createApolloProvider({
// //   defaultClient: apolloClient,
// // });

// createApp(App).provide(provideApolloClient(apolloClient)).mount("#app");
// // createApp(App).use(apolloProvider).mount("#app");

import { createApp, h } from "vue";
import App from "./App.vue";

import "./assets/main.css";

import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { createApolloProvider } from "@vue/apollo-option";
import {
  provideApolloClient,
  provideApolloClients,
} from "@vue/apollo-composable";

// const cache = new InMemoryCache();

const api1Client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.thegraph.com/subgraphs/name/jack-meta-zhang/feinft",
});

const api2Client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.thegraph.com/subgraphs/name/jack-meta-zhang/nftmarketplace",
});

const apolloClients = {
  api1: api1Client,
  api2: api2Client,
};

//   const apolloProvider = createApolloProvider({
//     clients: apolloClients,
//   });
// const apolloProvider = createApolloProvider({
//   defaultClient: apolloClient,
// });

//暂时不知道怎么使用两个client
createApp(App)
  .provide(provideApolloClient(apolloClients.api2))
  .provide("apolloClients", apolloClients)
  .mount("#app");
