import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { Button, Modal, Icon, Form, Dropdown, Portal } from 'semantic-ui-react';

import { createTodo as mutation } from '../graphql/mutations';
import { listTodos } from '../graphql/queries';
import useNotification from '../hooks/useNotification';

const CreateTodo = props => {
  const [todo, setTodo] = useState('');
  const [due, setDue] = useState('');
  const [category, setCategory] = useState('');
  const [categoryText, setCategoryText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const notification = useNotification();

  const createTodo = useMutation(gql(mutation));

  const handleOpen = () => {
    setIsOpen(true);
  };

  const getCategoryOptionFromProps = () => {
    if (!props.categoryOptions) {
      return 'Loading...';
    } else {
      const matchCategory = props.categoryOptions.find(
        elm => elm.text === props.category,
      );
      return matchCategory || { text: 'Inbox', value: 'Inbox' };
    }
  };

  useEffect(() => {
    const option = getCategoryOptionFromProps();
    setCategory(option.value);
    setCategoryText(option.text);
  }, [props.category, props.categoryOptions]);

  const handleCreateTodo = () => {
    setTodo('');
    setDue('');
    setCategory('');
    setCategoryText('');

    const input = {
      name: todo,
      done: false,
    };
    if (due !== '') input.due = due;
    if (category !== '') input.todoCategoryId = category;
    const categoryName =
      'todoCategoryId' in input
        ? props.categoryOptions.find(elm => elm.value === input.todoCategoryId)
        : null;

    createTodo({
      variables: { input },
      optimisticResponse: {
        createTodo: {
          id: 'Loading...',
          name: input.name,
          due: 'due' in input ? input.due : '',
          done: false,
          __typename: 'Todo',
          category: {
            id: 'Loading...',
            name: categoryName !== null ? categoryName.text : 'Inbox',
            __typename: 'Category',
            Todos: {
              nextToken: null,
              __typename: 'ModelTodoConnection',
            },
          },
        },
      },
      update: (store, { data: { createTodo } }) => {
        const data = store.readQuery({
          query: gql(listTodos),
          variables: { limit: 100 },
        });
        data.listTodos.items.push(createTodo);
        store.writeQuery({
          query: gql(listTodos),
          variables: { limit: 100 },
          data,
        });
      },
    });

    notification.handleNotification('タスクを追加しました');
  };

  if (!props.categoryOptions) return <div />;

  return (
    <>
      {notification.Notification}
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        centered={false}
        trigger={
          <Portal open>
            <Button
              onClick={handleOpen}
              style={{
                width: '60px',
                height: '60px',
                right: '30px',
                bottom: '50px',
                position: 'fixed',
                zIndex: 1000,
                filter: 'drop-shadow(0px 0px 1px silver)',
                padding: 0,
                margin: 0,
              }}
              circular
              color="teal"
            >
              <i className="fas fa-plus fa-2x" />
            </Button>
          </Portal>
        }
      >
        <Modal.Header>タスクを追加</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>やること</label>
              <input
                value={todo}
                onChange={e => setTodo(e.target.value)}
                onClose={() => setIsOpen(false)}
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
                onChange={(e, data) => {
                  setCategory(data.value);
                  const currentOption = data.options.find(
                    elm => elm.value === data.value,
                  );
                  setCategoryText(currentOption.text);
                }}
                text={categoryText}
                fluid
                selection
                options={props.categoryOptions}
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
            disabled={!todo}
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

export default CreateTodo;
