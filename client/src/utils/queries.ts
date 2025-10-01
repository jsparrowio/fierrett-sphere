// import graphQL from Apollo to set up quieries to be used elsewhere
// queries match server side mutations
import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query Me {
   Me {
    _id
    first_name
    email
    last_name
    username
    }
    # team {
    #   name
    #   _id
    # }
  }
`;
