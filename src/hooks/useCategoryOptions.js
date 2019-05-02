import { API, graphqlOperation } from "aws-amplify";
import { listCategorys } from "../graphql/queries";

export default async () => {
  const res = await API.graphql(graphqlOperation(listCategorys));
  let userOptions = res.data.listCategorys.items.map(elm => {
    return {
      key: elm.id,
      value: elm.id,
      text: elm.name
    };
  });

  userOptions.push({
    key: "Inbox",
    value: "Inbox",
    text: "Inbox"
  });

  return userOptions;
};
