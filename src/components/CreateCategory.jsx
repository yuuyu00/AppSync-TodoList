import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { Button, Modal, Icon, Form, Menu } from 'semantic-ui-react';

import { createCategory as mutation } from '../graphql/mutations';
import { listCategorys } from '../graphql/queries';
import useNotification from '../hooks/useNotification';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const notification = useNotification();

  const createCategory = useMutation(gql(mutation));

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleCreateTodo = () => {
    setName('');

    const input = {
      name,
    };

    createCategory({
      variables: { input },
      optimisticResponse: {
        createCategory: {
          id: 'Loading...',
          name: input.name,
          __typename: 'Category',
          Todos: {
            nextToken: null,
            id: 'Loading',
            name: 'Loading',
            __typename: 'Todo',
            items: [],
          },
        },
      },
      update: (store, { data: { createCategory } }) => {
        const data = store.readQuery({
          query: gql(listCategorys),
          variables: { limit: 100 },
        });
        data.listCategorys.items.push(createCategory);
        store.writeQuery({
          query: gql(listCategorys),
          variables: { limit: 100 },
          data,
        });
      },
    });
    notification.handleNotification('カテゴリーを追加しました');
  };

  return (
    <>
      {notification.Notification}
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        centered={false}
        trigger={
          <Button
            style={{ marginTop: '7px', width: '90%' }}
            onClick={() => setIsOpen(true)}
          >
            <i className="fas fa-plus" />
          </Button>
        }
      >
        <Modal.Header>カテゴリーを追加</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>カテゴリー名</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                onClose={() => setIsOpen(false)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setIsOpen(false)}>
            <Icon name="remove" />
            キャンセル
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleCreateTodo();
              setIsOpen(false);
            }}
          >
            <Icon name="checkmark" />
            追加
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default CreateCategory;
