import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import {
  Button,
  Header,
  Image,
  Modal,
  Icon,
  Form,
  Dropdown
} from "semantic-ui-react";

import { createTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";

const CreateTodo = props => {
  const [todo, setTodo] = useState("");
  const [desc, setDesc] = useState("");
  const [assignee, setAssignee] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateTodo = () => {
    setTodo("");
    setDesc("");
    setAssignee("");

    const input = {
      name: todo,
      description: desc === "" ? null : desc,
      todoAssigneeId: assignee
    };
    props.addTodo(input);
  };

  if (!props.userOptions) return <div />;

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={<Button onClick={() => setIsOpen(true)}>Add Todo</Button>}
    >
      <Modal.Header>Select a Photo</Modal.Header>
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
            <label>Description</label>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Description"
            />
          </Form.Field>
          <Form.Field>
            <label>Assignee</label>
            <Dropdown
              placeholder="Select Assignee"
              onChange={(e, data) => setAssignee(data.value)}
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
  );
};

const query = gql(listTodos);

export default graphql(gql(createTodo), {
  props: props => ({
    addTodo: input => {
      props.mutate({
        variables: { input },
        optimisticResponse: {
          createTodo: {
            id: "",
            name: input.name,
            description: "Loading...",
            __typename: "Todo",
            assignee: {
              id: "",
              name: "Loading...",
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
          console.log(createTodo);

          // Write our data back to the cache.
          store.writeQuery({ query, variables: { limit: 100 }, data });
        }
      });
    }
  })
})(CreateTodo);
