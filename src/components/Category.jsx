import React from "react";
import { listCategorys } from "../graphql/queries";
import { Menu } from "semantic-ui-react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import history from "../history";

import CreateCategory from "./CreateCategory";

const Categories = props => {
  const renderCategories = () => {
    return props.data.listCategorys.items.map(elm => {
      return (
        <Menu.Item
          key={elm.id}
          as="a"
          onClick={() => history.push(`/${elm.name}`)}
        >
          {elm.name}
        </Menu.Item>
      );
    });
  };

  if (props.data.loading) return <div>Loading...</div>;
  return (
    <>
      <Menu.Item as="a" onClick={() => history.push(`/`)}>
        All Todos
      </Menu.Item>
      <Menu.Item as="a" onClick={() => history.push(`/Inbox`)}>
        Inbox
      </Menu.Item>
      {renderCategories()}
      <CreateCategory />
    </>
  );
};

export default graphql(gql(listCategorys), {
  options: props => ({ variables: { limit: 100 } })
})(Categories);
