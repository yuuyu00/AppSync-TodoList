import React, { useState } from "react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { Button, Header, Image, Modal, Icon, Form } from "semantic-ui-react";

import { deleteTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";

const DeleteTodo = props => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteTodo = () => {
    const input = {
      id: props.id
    };

    props.deleteTodo(input);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={<Button onClick={() => setIsOpen(true)}>Delete</Button>}
      basic
      size="small"
    >
      <Header icon="archive" content="Delete Todo" />
      <Modal.Content>
        <p>{`Are you sure you want yo delete "${props.todoname}"?`}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setIsOpen(false)} basic color="grey" inverted>
          <Icon name="remove" /> Cancel
        </Button>
        <Button
          onClick={() => {
            setIsOpen(false);
            handleDeleteTodo();
          }}
          color="red"
          inverted
        >
          <Icon name="checkmark" /> Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default graphql(gql(deleteTodo), {
  props: props => ({
    deleteTodo: input => {
      props.mutate({
        variables: { input },
        optimisticResponse: {
          deleteTodo: {
            id: input.id
          }
        },
        update: (store, { data: { deleteTodo } }) => {
          const data = store.readQuery({
            query: gql(listTodos),
            variables: { limit: 100 }
          });
          console.log(data);
          data.listTodos.items = data.listTodos.items.filter(
            elm => elm.id !== deleteTodo.id
          );
          store.writeQuery({
            query: gql(listTodos),
            variables: { limit: 100 },
            data
          });
        }
      });
    }
  })
})(DeleteTodo);
