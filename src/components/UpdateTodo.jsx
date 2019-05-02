import React, { useState } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Button, Modal, Icon, Form, Dropdown } from "semantic-ui-react";

import { updateTodo } from "../graphql/mutations";

const UpdateTodo = props => {
  const [todo, setTodo] = useState(props.todo.name);
  const [due, setDue] = useState(props.todo.description);
  const [assignee, setAssignee] = useState(props.todo.assignee.id);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdateTodo = () => {
    setIsOpen(false);
    const input = {
      id: props.todo.id,
      name: todo,
      description: due,
      todoAssigneeId: assignee
    };

    const assigneeName = props.userOptions.find(
      elm => elm.value === input.todoAssigneeId
    );

    props.updateTodo(input, { assigneeName });
    props.handleNotification("Task Edited.");
  };

  if (!props.userOptions) return <div />;

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={
        <Button onClick={() => setIsOpen(true)}>
          <Icon name="pencil" style={{ margin: "auto" }} />
        </Button>
      }
    >
      <Modal.Header>Edit Task</Modal.Header>
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
              onChange={(e, data) => {
                setAssignee(data.value);
              }}
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
    updateTodo: (input, optimisticVal) => {
      props.mutate({
        variables: { input },
        optimisticResponse: {
          updateTodo: {
            id: input.id,
            name: input.name,
            description: input.description,
            __typename: "Todo",
            assignee: {
              id: input.todoAssigneeId,
              name: optimisticVal.assigneeName.text,
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
