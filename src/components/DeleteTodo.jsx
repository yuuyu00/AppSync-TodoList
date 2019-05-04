import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { Button, Header, Modal, Icon } from 'semantic-ui-react';

import { deleteTodo as mutation } from '../graphql/mutations';
import { listTodos } from '../graphql/queries';

const DeleteTodo = props => {
  const deleteTodo = useMutation(gql(mutation));

  const handleDeleteTodo = () => {
    props.setOpenDelete('');

    const input = {
      id: props.id,
    };

    deleteTodo({
      variables: { input },
      optimisticResponse: {
        deleteTodo: {
          id: input.id,
        },
      },
      update: (store, { data: { deleteTodo } }) => {
        const data = store.readQuery({
          query: gql(listTodos),
          variables: { limit: 100 },
        });
        data.listTodos.items = data.listTodos.items.filter(
          elm => elm.id !== deleteTodo.id,
        );
        store.writeQuery({
          query: gql(listTodos),
          variables: { limit: 100 },
          data,
        });
      },
    });

    props.handleNotification('タスクを削除しました');
  };

  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpenDelete('')}
      basic
      size="small"
    >
      <Header icon="archive" content="タスクを削除" />
      <Modal.Content>
        <p>{`"${props.todoname}"を削除してもよろしいですか?`}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => props.setOpenDelete('')}
          basic
          color="grey"
          inverted
        >
          <Icon name="remove" />
          キャンセル
        </Button>
        <Button
          onClick={() => {
            handleDeleteTodo();
          }}
          color="red"
          inverted
        >
          <Icon name="checkmark" />
          削除
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteTodo;
