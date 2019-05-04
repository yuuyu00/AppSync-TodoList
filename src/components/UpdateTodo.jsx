import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { Button, Modal, Icon, Form, Dropdown } from 'semantic-ui-react';

import { updateTodo as mutation } from '../graphql/mutations';
import useNotification from '../hooks/useNotification';

const UpdateTodo = props => {
  const [todo, setTodo] = useState(props.todo.name);
  const [due, setDue] = useState(props.todo.due);
  const [category, setCategory] = useState(
    props.todo.category !== null ? props.todo.category.id : 'Inbox',
  );
  const notification = useNotification();

  const updateTodo = useMutation(gql(mutation));

  const handleUpdateTodo = () => {
    props.setOpenUpdate('');
    const input = {
      id: props.todo.id,
      name: todo,
      due,
      todoCategoryId: category,
    };

    const categoryName = props.categoryOptions.find(
      elm => elm.value === input.todoCategoryId,
    );

    updateTodo({
      variables: { input },
      optimisticResponse: {
        updateTodo: {
          id: input.id,
          name: input.name,
          due: input.due,
          __typename: 'Todo',
          category: {
            id: input.todoCategoryId,
            name: categoryName.text,
            __typename: 'User',
            Todos: {
              nextToken: null,
              __typename: 'ModelTodoConnection',
            },
          },
        },
      },
    });

    notification.handleNotification('タスクを更新しました');
  };

  if (!props.categoryOptions) return <div />;

  return (
    <>
      {notification.Notification}
      <Modal
        open={props.open}
        centered={false}
        onClose={() => props.setOpenUpdate('')}
      >
        <Modal.Header>タスクを編集</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>やること</label>
              <input
                value={todo}
                onChange={e => setTodo(e.target.value)}
                placeholder="タスクを追加"
              />
            </Form.Field>
            <Form.Field>
              <label>期日</label>
              <input
                value={due}
                onChange={e => setDue(e.target.value)}
                placeholder="期日を追加"
              />
            </Form.Field>
            <Form.Field>
              <label>カテゴリー</label>
              <Dropdown
                placeholder="Select Category"
                onChange={(e, data) => {
                  setCategory(data.value);
                }}
                value={category}
                fluid
                selection
                options={props.categoryOptions}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => props.setOpenUpdate('')}>
            <Icon name="remove" />
            Cancel
          </Button>
          <Button color="green" onClick={handleUpdateTodo}>
            <Icon name="checkmark" onClick={() => props.setOpenUpdate('')} />
            Update
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default UpdateTodo;
