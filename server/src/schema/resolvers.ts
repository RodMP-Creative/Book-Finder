import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { IResolvers } from '@graphql-tools/utils';

const resolvers: IResolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {

      // If user is logged in, return user data
      if (context.user) {

        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');
          
        if (userData) {
          userData.bookCount = userData.savedBooks.length;
          return userData;
        }

        throw new Error('User not found');
      }

      // If user is not logged in, throw an error
      throw new Error('login to view this information');
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });

      // If user doesn't exist, throw an error
      if (!user) {
        throw new Error("User doesn't exist");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Login failed! Please try again');
      }

      // If user exists and password is correct, sign a token
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_parent: any, args: any) => {
      // Create a new user
      const user = await User.create(args);
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: any, { bookData }: { bookData: any }, context: any) => {
      // If user is logged in, save book to user
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new Error('Login to save this book');
    },
    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
      // If user is logged in, remove book from user
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser;
      }
      throw new Error('Log in to remove this book');
    },
  },
};

export default resolvers;
