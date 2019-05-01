import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";
import AppSyncConfig from "./aws-exports";
import { ApolloProvider } from "react-apollo";
import { Rehydrated } from "aws-appsync-react";
import Amplify, { Auth } from "aws-amplify";
// import { InMemoryCache } from "apollo-cache-inmemory";

Amplify.configure(AppSyncConfig);

// const cache = new InMemoryCache();

const client = new AWSAppSyncClient({
  url: AppSyncConfig.aws_appsync_graphqlEndpoint,
  region: AppSyncConfig.aws_appsync_region,
  // cache,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  disableOffline: true
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>,
  document.getElementById("root")
);
