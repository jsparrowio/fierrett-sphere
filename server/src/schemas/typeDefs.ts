// set up type definitions for GraphQL/Apollo
// also sets up input types, queries, and mutations, which allow for the modification of data in the database
const gql = String.raw
const typeDefs = gql`
type User {
    _id: ID
    username: String
    first_name: String
    last_name: String
    email: String
    password: String
    # team: [Pokemon]!
    # teamCount: Int
}

input UserInput {
    username: String!
    first_name: String!
    last_name: String!
    email: String!
    password: String!
}

input UserProfile {
    username: String!
    first_name: String!
    last_name: String!
    email: String!
}

# type Item {
#     _id: ID
#     name: String
#     itemId: Int
#     sprite: String
#     quantity: Int
# }

# input ItemInput {
#     name: String!
#     itemId: Int!
#     sprite: String!
# }

type Auth {
    token: ID!
    user: User!
}

type Query {
    Me: User
}

type Mutation {
    login(username: String!, password: String!): Auth
    addUser(input: UserInput!): Auth
    updateProfile(input: UserProfile!): User
    updatePassword(password: String!): String
    confirmPassword(currentPassword: String!): Boolean
    deleteUser(_id: ID!): String
    # addToTeam(_id: ID!): User
    # removeFromTeam(_id: ID!): User
    # updateTeam(_id: ID!): User
    # resetTeam(_id: ID!): User
}
`;

// export typeDefs to be used elsewhere
export default typeDefs;