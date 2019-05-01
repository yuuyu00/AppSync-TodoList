import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "../graphql/queries";

export default async () => {
  const res = await API.graphql(graphqlOperation(listUsers));
  let userOptions = res.data.listUsers.items.map(elm => {
    return {
      key: elm.id,
      value: elm.id,
      text: elm.name
    };
  });

  userOptions.push({
    key: "none",
    value: "none",
    text: "none"
  });

  return userOptions;
};
