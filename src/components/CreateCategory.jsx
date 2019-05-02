import React, { useState } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Button, Modal, Icon, Form, Menu } from "semantic-ui-react";

import { createCategory } from "../graphql/mutations";
import { listCategorys } from "../graphql/queries";
import useNotification from "../hooks/useNotification";

const CreateCategory = props => {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const notification = useNotification();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleCreateTodo = () => {
    setName("");

    const input = {
      name: name
    };
    const categoryName =
      "todoCategoryId" in input
        ? props.userOptions.find(elm => elm.value === input.todoCategoryId)
        : null;

    props.addCategory(input, { categoryName });
    notification.handleNotification("Task Added.");
  };

  return (
    <>
      {notification.Notification}
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        centered={false}
        trigger={
          <Menu.Item as="a" onClick={handleOpen}>
            Add...
          </Menu.Item>
        }
      >
        <Modal.Header>Add Category</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Category Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                onClose={() => setIsOpen(false)}
                placeholder="Category Name"
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
    </>
  );
};

const query = gql(listCategorys);

export default graphql(gql(createCategory), {
  props: props => ({
    addCategory: input => {
      props.mutate({
        variables: { input },
        optimisticResponse: {
          createCategory: {
            id: "",
            name: input.name,
            __typename: "Category",
            Todos: {
              id: "",
              name: "",
              __typename: "Todo",
              Categorys: {
                nextToken: null,
                __typename: "ModelCategoryConnection"
              }
            }
          }
        },
        update: (store, { data: { createTodo } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query, variables: { limit: 100 } });

          // Add our comment from the mutation to the end.
          data.listCategorys.items.push(createCategory);

          // Write our data back to the cache.
          store.writeQuery({ query, variables: { limit: 100 }, data });
        }
      });
    }
  })
})(CreateCategory);
