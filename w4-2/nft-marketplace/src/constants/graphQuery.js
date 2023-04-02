import gql from "graphql-tag";

export const GetUsersGql = gql`
  query {
    users(first: 10, orderBy: tokenId) {
      id
      tokenId
      address
    }
  }
`;
export const getActiveItemGql = gql`
  query {
    activeItems(first: 10, orderBy: seller) {
      buyer
      amount
      seller
      tokenId
    }
  }
`;
