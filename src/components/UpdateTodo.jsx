import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { Button, Modal, Icon, Form, Dropdown } from "semantic-ui-react";

import { updateTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";
import useUserOptions from "../hooks/useUserOptions";

const UpdateTodo = props => {
  const [todoId, setTodoId] = useState(props.todo.id);
  const [todo, setTodo] = useState(props.todo.name);
  const [desc, setDesc] = useState(props.todo.description);
  const [assignee, setAssignee] = useState(props.todo.assignee.id);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdateTodo = () => {
    setIsOpen(false);

    const input = {
      id: todoId,
      name: todo,
      description: desc,
      todoAssigneeId: assignee
    };

    props.updateTodo(input);
  };

  if (!props.userOptions) return <div />;

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={<Button onClick={() => setIsOpen(true)}>Edit</Button>}
    >
      <Modal.Header>Select a Photo</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Todo</label>
            <input
              value={todo}
              onChange={e => setTodo(e.target.value)}
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
              value={assignee}
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
        <Button color="green" onClick={handleUpdateTodo}>
          <Icon name="checkmark" onClick={() => setIsOpen(false)} /> Update
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default graphql(gql(updateTodo), {
  props: props => ({
    updateTodo: input => {
      props.mutate({
        variables: { input },
        optimisticResponse: {
          updateTodo: {
            id: input.id,
            name: input.name,
            description: input.description,
            __typename: "Todo",
            assignee: {
              id: input.assignee,
              name: "Loading...",
              __typename: "User",
              Todos: {
                nextToken: null,
                __typename: "ModelTodoConnection"
              }
            }
          }
        }
      });
    }
  })
})(UpdateTodo);
