import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($userEmail: String!, $userPassword: String!) {
    login(email: $userEmail, password: $userPassword) {
      token
      user {
        id: _id
        name: username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation registerUser($userName: String!, $userEmail: String!, $userPassword: String!) {
    addUser(username: $userName, email: $userEmail, password: $userPassword) {
      token
      user {
        id: _id
        name: username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
      id: _id
      name: username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation deleteBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      id: _id
      name: username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
