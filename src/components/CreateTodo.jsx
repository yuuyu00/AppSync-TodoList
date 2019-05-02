import React, { useState } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Button, Modal, Icon, Form, Dropdown } from "semantic-ui-react";

import { createTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";

const CreateTodo = props => {
  const [todo, setTodo] = useState("");
  const [due, setDue] = useState("");
  const [assignee, setAssignee] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleCreateTodo = () => {
    setTodo("");
    setDue("");
    setAssignee("");

    const input = {
      name: todo,
      description: due === "" ? null : due,
      todoAssigneeId: assignee
    };
    const assigneeName = props.userOptions.find(
      elm => elm.value === input.todoAssigneeId
    );

    props.addTodo(input, { assigneeName });
    props.handleNotification("Task Added.");
  };

  if (!props.userOptions) return <div />;

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      centered={false}
      trigger={
        <Icon
          onClick={handleOpen}
          name="add"
          color="blue"
          style={{ margin: "auto", fontSize: "30px" }}
        />
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
    addTodo: (input, optimisticVal) => {
      props.mutate({
        variables: { input },
        optimisticResponse: {
          createTodo: {
            id: "",
            name: input.name,
            description: input.description,
            __typename: "Todo",
            assignee: {
              id: "",
              name: optimisticVal.assigneeName.text,
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
