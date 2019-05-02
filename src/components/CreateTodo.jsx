import React, { useState } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Button, Modal, Icon, Form, Dropdown, Portal } from "semantic-ui-react";

import { createTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";
import useNotification from "../hooks/useNotification";

const CreateTodo = props => {
  const [todo, setTodo] = useState("");
  const [due, setDue] = useState("");
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const notification = useNotification();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleCreateTodo = () => {
    setTodo("");
    setDue("");
    setCategory("");

    const input = {
      name: todo
    };
    if (due !== "") input.due = due;
    if (category !== "") input.todoCategoryId = category;
    const categoryName =
      "todoCategoryId" in input
        ? props.userOptions.find(elm => elm.value === input.todoCategoryId)
        : null;

    console.log(input);
    props.addTodo(input, { categoryName });
    notification.handleNotification("Task Added.");
  };

  if (!props.userOptions) return <div />;

  return (
    <>
      {notification.Notification}
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        centered={false}
        trigger={
          <Portal open={true}>
            <Button
              onClick={handleOpen}
              style={{
                width: "60px",
                height: "60px",
                right: "30px",
                bottom: "70px",
                position: "fixed",
                zIndex: 1000,
                filter: "drop-shadow(0px 0px 1px silver)",
                padding: 0,
                margin: 0
              }}
              circular
              color="teal"
            >
              <i className="fas fa-plus fa-2x" />
            </Button>
          </Portal>
        }
      >
        <Modal.Header>Add Task</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Todo</label>
              <input
                value={todo}
                onChange={e => setTodo(e.target.value)}
                onClose={() => setIsOpen(false)}
                placeholder="Todo"
              />
            </Form.Field>
            <Form.Field>
              <label>Due</label>
              <input
                value={due}
                onChange={e => setDue(e.target.value)}
                placeholder="Due"
              />
            </Form.Field>
            <Form.Field>
              <label>Category</label>
              <Dropdown
                defaultValue="Inbox"
                placeholder="Select Category"
                onChange={(e, data) => setCategory(data.value)}
                fluid
                selection
                options={props.userOptions}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setIsOpen(false)}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleCreateTodo();
              setIsOpen(false);
            }}
          >
            <Icon name="checkmark" /> Add
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const query = gql(listTodos);

export default graphql(gql(createTodo), {
  props: props => ({
    addTodo: (input, optimisticVal) => {
      // console.log(optimisticVal);
      // const categoryName =
      //   optimisticVal.categoryName === undefined
      //     ? "Loading..."
      //     : optimisticVal.categoryName.text;
      props.mutate({
        variables: { input },
        optimisticResponse: {
          createTodo: {
            id: "",
            name: input.name,
            due: "due" in input ? input.due : "",
            __typename: "Todo",
            category: {
              id: "",
              name:
                optimisticVal.categoryName !== null
                  ? optimisticVal.categoryName.text
                  : "Inbox",
              __typename: "User",
              Todos: {
                nextToken: null,
                __typename: "ModelTodoConnection"
              }
            }
          }
        },
        update: (store, { data: { createTodo } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query, variables: { limit: 100 } });

          // Add our comment from the mutation to the end.
          data.listTodos.items.push(createTodo);

          // Write our data back to the cache.
          store.writeQuery({ query, variables: { limit: 100 }, data });
        }
      });
    }
  })
})(CreateTodo);
