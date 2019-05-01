import React from "react";
import { withAuthenticator } from "aws-amplify-react";
import TodoList from "./components/TodoList";

function App() {
  return (
    <>
      <TodoList />
    </>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
// export default App;
