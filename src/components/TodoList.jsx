import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';
import {
  List,
  Menu,
  Sidebar,
  Segment,
  Button,
  Icon,
  Header,
  Loader,
  Popup,
} from 'semantic-ui-react';

import { listTodos, listCategorys } from '../graphql/queries';
import { updateTodo as mutation } from '../graphql/mutations';
import CreateTodo from './CreateTodo';
import DeleteTodo from './DeleteTodo';
import UpdateTodo from './UpdateTodo';
import useCategoryOptions from '../hooks/useCategoryOptions';
import useNotification from '../hooks/useNotification';
import Category from './Category';
import history from '../history';

const TodoList = props => {
  const [categoryOptions, setCategoryOptions] = useState(null);
  const [show, setShow] = useState(false);
  const getCategoryOptions = useCategoryOptions;
  const notification = useNotification();
  const [openUpdate, setOpenUpdate] = useState('');
  const [openDelete, setOpenDelete] = useState('');

  const { data, loading } = useQuery(gql(listTodos), {
    variables: { limit: 100 },
  });

  const categoryData = useQuery(gql(listCategorys), {
    variables: { limit: 100 },
  });

  useEffect(() => {
    if (!categoryData.loading) {
      const fetchedCategoryOptions = getCategoryOptions(categoryData.data);
      setCategoryOptions(fetchedCategoryOptions);
    }
  }, [categoryData.loading, categoryData]);

  const updateTodo = useMutation(gql(mutation));

  const toggleTodoDone = elm => {
    const input = {
      id: elm.id,
      done: !elm.done,
    };

    updateTodo({
      variables: { input },
      optimisticResponse: {
        updateTodo: {
          id: elm.id,
          name: elm.name,
          due: elm.due,
          done: input.done,
          __typename: 'Todo',
          category: {
            id: elm.category !== null ? elm.category.id : 'Loading...',
            name: elm.category !== null ? elm.category.name : 'Inbox',
            __typename: 'User',
            Todos: {
              nextToken: null,
              __typename: 'ModelTodoConnection',
            },
          },
        },
      },
    });
  };

  const renderTodos = () => {
    let todoItems;
    if ('category' in props.match.params) {
      if (props.match.params.category === 'signin') history.push('/');

      if (props.match.params.category === 'Inbox') {
        todoItems = data.listTodos.items.filter(elm => {
          return elm.category === null;
        });
      } else {
        todoItems = data.listTodos.items.filter(elm => {
          return (
            elm.category !== null &&
            elm.category.name === props.match.params.category
          );
        });
      }
    } else {
      todoItems = data.listTodos.items;
    }

    return (
      <>
        <List
          style={{
            paddingRight: '3%',
            paddingLeft: '3%',
            paddingTop: '15px',
            marginBottom: '50px',
          }}
        >
          <Header as="h2">{props.match.params.category || 'All Todos'}</Header>
          {todoItems.map(elm => {
            const category =
              elm.category !== null ? elm.category.name : 'Inbox';
            return (
              <List.Item key={elm.id}>
                <List.Content floated="right">
                  <span style={{ marginRight: '10px' }}>{elm.due}</span>
                  <Popup
                    as={Menu}
                    vertical
                    style={{ width: 'auto', zIndex: 500 }}
                    trigger={
                      <Icon
                        style={{ cursor: 'pointer' }}
                        name="ellipsis horizontal"
                        color="grey"
                        size="large"
                      />
                    }
                    on="click"
                    position="left center"
                  >
                    <Menu.Item
                      link
                      style={{ paddingTop: '8px', paddingBottom: '8px' }}
                      onClick={() => setOpenUpdate(elm.id)}
                    >
                      <Icon
                        name="pencil"
                        size="large"
                        style={{ margin: 'auto' }}
                      />
                    </Menu.Item>
                    <Menu.Item
                      link
                      onClick={() => {
                        setOpenDelete(elm.id);
                      }}
                    >
                      <Icon
                        name="trash alternate"
                        size="large"
                        color="red"
                        style={{ margin: 'auto' }}
                      />
                    </Menu.Item>
                  </Popup>
                  <UpdateTodo
                    todo={elm}
                    open={elm.id === openUpdate}
                    setOpenUpdate={setOpenUpdate}
                    categoryOptions={categoryOptions}
                    todos={todoItems}
                  />
                  <DeleteTodo
                    id={elm.id}
                    open={elm.id === openDelete}
                    setOpenDelete={setOpenDelete}
                    todoname={elm.name}
                    handleNotification={notification.handleNotification}
                  />
                </List.Content>
                <List.Content floated="left">
                  {/* <Checkbox style={{ marginTop: '5px', marginBotton: '5px' }} /> */}
                  <Icon
                    name={`check circle${!elm.done ? ' outline' : ''}`}
                    size="large"
                    style={{
                      marginTop: '5px',
                      marginBotton: '5px',
                      marginLeft: '5px',
                      color: `${elm.done ? '#00B5AD' : 'silver'}`,
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleTodoDone(elm)}
                  />
                </List.Content>
                <List.Content>
                  <List.Header>{elm.name}</List.Header>
                  {category}
                </List.Content>
              </List.Item>
            );
          })}
        </List>
      </>
    );
  };

  const renderSidebar = () => {
    return (
      <>
        <Sidebar.Pushable as={Segment} style={{ marginTop: '0' }}>
          <Sidebar
            as={Menu}
            animation="overlay"
            icon="labeled"
            onHide={() => setShow(false)}
            vertical
            visible={show}
            width="thin"
            style={{ bottom: '0' }}
            onClick={() => setShow(false)}
          >
            <Category />
          </Sidebar>
          <Sidebar.Pusher
            style={{ height: '100%' }}
            dimmed={show}
            onClick={() => {
              if (show) {
                setShow(false);
              }
            }}
          >
            {renderTodos(props)}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </>
    );
  };

  const renderMenu = () => {
    return (
      <Menu fixed="top" borderless style={{ backgroundColor: '#00b5ad' }}>
        <Menu.Item onClick={() => setShow(true)}>
          <Icon name="bars" style={{ color: 'white' }} />
        </Menu.Item>
        <Menu.Item>
          <Icon name="checkmark" size="large" style={{ color: 'white' }} />
          <span style={{ fontSize: '18px', color: 'white' }}>Todo</span>
        </Menu.Item>
        <Menu.Item position="right" style={{ paddingRight: '10%' }} />
        <Menu.Item>
          <Button
            onClick={async () => {
              await Auth.signOut();
              history.push('/');
            }}
          >
            サインアウト
          </Button>
        </Menu.Item>
      </Menu>
    );
  };

  if (loading) {
    return <Loader active>Loading...</Loader>;
  }
  return (
    <div style={{ height: '100%' }}>
      {renderMenu()}
      {renderSidebar()}
      <CreateTodo
        todos={data.listTodos.items}
        categoryOptions={categoryOptions}
        category={props.match.params.category}
      />
      {notification.Notification}
    </div>
  );
};

export default TodoList;
