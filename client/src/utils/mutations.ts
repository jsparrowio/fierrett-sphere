import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($input: UserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
    }
    token
  }
}
`;

export const UPDATE_PROFILE = gql`
mutation UpdateProfile($input: UserProfile!) {
updateProfile(input: $input) {
    username
    first_name
    last_name
    email
  }
}
`

export const CONFIRM_PASSWORD = gql`
mutation ConfirmPassword($currentPassword: String!) {
  confirmPassword(currentPassword: $currentPassword)
}
`

export const UPDATE_PASSWORD = gql`
mutation UpdatePassword($password: String!) {
  updatePassword(password: $password)
}
`

export const DELETE_USER = gql`
mutation DeleteUser($id: ID!) {
  deleteUser(_id: $id)
}
`

// export const RESET_TEAM = gql`
// mutation ResetTeam($id: ID!) {
//   resetTeam(_id: $id) {
//     teamCount
//   }
// }
// `
// export const ADD_TO_TEAM = gql`
//   mutation AddToTeam($_id: ID!) {
//     addToTeam(_id: $_id) {
//       team {
//         _id
//         name
//       }
//     }
//   }
// `;

// export const UPDATE_TEAM = gql`
// mutation UpdateTeam($id: ID!) {
//   updateTeam(_id: $id) {
//     teamCount
//   }
// }
// `

// export const REMOVE_FROM_TEAM = gql`
// mutation RemoveFromTeam($id: ID!) {
//   removeFromTeam(_id: $id) {
//     teamCount
//   }
// }
// `

