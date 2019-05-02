import React, { useState } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Button, Modal, Icon, Form, Dropdown } from "semantic-ui-react";

import { updateTodo } from "../graphql/mutations";
import useNotification from "../hooks/useNotification";

const UpdateTodo = props => {
  const [todo, setTodo] = useState(props.todo.name);
  const [due, setDue] = useState(props.todo.due);
  const [category, setCategory] = useState(
    props.todo.category !== null ? props.todo.category.id : "Inbox"
  );
  const [isOpen, setIsOpen] = useState(false);
  const notification = useNotification();

  const handleUpdateTodo = () => {
    setIsOpen(false);
    const input = {
      id: props.todo.id,
      name: todo,
      due: due,
      todoCategoryId: category
    };

    const categoryName = props.userOptions.find(
      elm => elm.value === input.todoCategoryId
    );

    props.updateTodo(input, { categoryName });
    notification.handleNotification("Task Edited.");
  };

  if (!props.userOptions) return <div />;

  return (
    <>
      {notification.Notification}
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
              <label>Category</label>
              <Dropdown
                defaultValue="Inbox"
                placeholder="Select Category"
                onChange={(e, data) => {
                  setCategory(data.value);
                }}
                value={category}
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
    </>
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
            due: input.due,
            __typename: "Todo",
            category: {
              id: input.todoCategoryId,
              name: optimisticVal.categoryName.text,
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
