import React, { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { Route, Router, Switch } from 'react-router-dom';
import { Menu, Icon, Button } from 'semantic-ui-react';

import history from './history';
import TodoList from './components/TodoList';
import Landing from './components/Landing';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

function App() {
  const [user, setUser] = useState();

  const getUserData = async () => {
    const gotUser = await Auth.currentAuthenticatedUser();
    if (gotUser) {
      setUser(gotUser);
    } else {
      setUser(null);
    }
  };

  const onHubCapsule = capsule => {
    switch (capsule.payload.event) {
      case 'signIn':
        getUserData();
        break;
      case 'signOut':
        setUser(null);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getUserData();
    Hub.listen('auth', onHubCapsule);
  }, []);

  const renderMenu = () => {
    return (
      <Menu fixed="top" borderless style={{ backgroundColor: '#00b5ad' }}>
        <Menu.Item onClick={() => history.push('/')}>
          <Icon name="checkmark" size="large" style={{ color: 'white' }} />
          <span style={{ fontSize: '18px', color: 'white' }}>Todo</span>
        </Menu.Item>
        <Menu.Item position="right" style={{ paddingRight: '10%' }} />
        <Menu.Item>
          <Button onClick={() => history.push('/signin')}>サインイン</Button>
        </Menu.Item>
      </Menu>
    );
  };

  if (user) {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={TodoList} />
          <Route path="/:category" component={TodoList} />
        </Switch>
      </Router>
    );
  } else {
    return (
      <Router history={history}>
        {renderMenu()}
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/signin" exact user={user} component={SignIn} />
          <Route path="/signup" exact component={SignUp} />
        </Switch>
      </Router>
    );
  }
}

export default App;
