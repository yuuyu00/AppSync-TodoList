import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import uuid from 'uuidv4';
import { Header, Icon, Button } from 'semantic-ui-react';

import history from '../history';

export default () => {
  const [isLoading, setIsLoading] = useState(false);

  const signUpAndSignIn = async () => {
    setIsLoading(true);

    const username = uuid();
    const password = uuid();
    await Auth.signUp({
      username,
      password,
      attributes: {
        email: `${uuid()}@${uuid()}.com`,
      },
    });
    Auth.signIn(username, password);
  };

  return (
    <Header as="h1" icon textAlign="center" style={{ paddingTop: '50px' }}>
      <Icon name="tasks" />
      <Header.Content>Let&apos;s Todo.</Header.Content>
      <Header.Subheader style={{ padding: '20px' }}>
        AWS AppSync(GraphQL) + AWS Cognito + AWS Amplify + Apollo
        Clientの使い方を学ぶために作ったシンプルなTodoアプリ
      </Header.Subheader>
      <Button
        size="large"
        style={{ marginTop: '20px' }}
        color="teal"
        onClick={signUpAndSignIn}
        loading={isLoading}
      >
        ログインせずに始める
      </Button>
      <Button
        size="large"
        style={{ marginTop: '20px' }}
        color="grey"
        onClick={() => history.push('/signup')}
      >
        サインアップ
      </Button>
    </Header>
  );
};
