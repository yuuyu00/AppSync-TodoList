export default data => {
  const categoryOptions = data.listCategorys.items.map(elm => {
    return {
      key: elm.id,
      value: elm.id,
      text: elm.name,
    };
  });

  categoryOptions.unshift({
    key: 'Inbox',
    value: 'Inbox',
    text: 'Inbox',
  });

  return categoryOptions;
};
