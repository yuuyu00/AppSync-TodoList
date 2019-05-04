import React from 'react';
import ReactDOM from 'react-dom';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import { ApolloProvider } from 'react-apollo';
import { Rehydrated } from 'aws-appsync-react';
import Amplify, { Auth } from 'aws-amplify';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';

import AppSyncConfig from './aws-exports';
import App from './App';

Amplify.configure(AppSyncConfig);

const client = new AWSAppSyncClient({
  url: AppSyncConfig.aws_appsync_graphqlEndpoint,
  region: AppSyncConfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken(),
  },
  disableOffline: true,
});

ReactDOM.render(
  <ApolloProvider client={client} style={{ height: '100%' }}>
    <ApolloHooksProvider client={client}>
      <Rehydrated>
        <App />
      </Rehydrated>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
