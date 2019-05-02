import React, { useState, useEffect } from "react";
import { Auth, Hub } from "aws-amplify";
import { Authenticator } from "aws-amplify-react";
import { Route, Router, Switch } from "react-router-dom";
import history from "./history";

import TodoList from "./components/TodoList";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    getUserData();
    Hub.listen("auth", onHubCapsule);
  }, []);

  const getUserData = async () => {
    const gotUser = await Auth.currentAuthenticatedUser();
    gotUser ? setUser(gotUser) : setUser(null);
  };

  const handleSignout = async () => {
    try {
      await Auth.signOut();
    } catch (err) {
      console.error("Error signing out user", err);
    }
  };

  const onHubCapsule = capsule => {
    switch (capsule.payload.event) {
      case "signIn":
        getUserData();
        break;
      case "signOut":
        setUser(null);
        break;
      default:
        break;
    }
  };

  if (!user) {
    return <Authenticator />;
  } else {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={TodoList} />
          <Route path="/:category" component={TodoList} />
        </Switch>
      </Router>
    );
  }
}

// export default withAuthenticator(App, { includeGreetings: true });
export default App;
