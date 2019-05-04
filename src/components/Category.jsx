import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

import { listCategorys } from '../graphql/queries';
import history from '../history';
import CreateCategory from './CreateCategory';

const Categories = () => {
  const { data, loading } = useQuery(gql(listCategorys), {
    variables: { limit: 100 },
  });

  const renderCategories = () => {
    return data.listCategorys.items.map(elm => {
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

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <Menu.Item as="a" onClick={() => history.push('/')}>
        All Todos
      </Menu.Item>
      <Menu.Item as="a" onClick={() => history.push('/Inbox')}>
        Inbox
      </Menu.Item>
      {renderCategories()}
      <CreateCategory />
    </>
  );
};

export default Categories;
