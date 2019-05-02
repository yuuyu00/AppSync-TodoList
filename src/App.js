import React, { useEffect } from "react";
import { withAuthenticator, SignIn } from "aws-amplify-react";
import { Route, Router, Switch } from "react-router-dom";
import { Auth } from "aws-amplify";
import history from "./history";

import TodoList from "./components/TodoList";
import Test from "./components/Test";

function App() {
  const a = Auth.currentAuthenticatedUser()
    .then(user => {
      return (
        <Router history={history}>
          <Switch>
            <Route path="/" exact component={TodoList} />
            <Route path="/test" exact component={Test} />
          </Switch>
        </Router>
      );
    })
    .catch(err => {
      return <button>a</button>;
    });

  useEffect(() => {
    Auth.signIn("test1", "testtest")
      .then(user => console.log(user))
      .catch(err => console.log(err));
  });

  const handleLogin = (username, password) => {
    Auth.signUp({
      username,
      password
    })
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={TodoList} />
        <Route path="/test" exact component={Test} />
      </Switch>
    </Router>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
// export default App;
