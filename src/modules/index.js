
/*
 A factory to help create singleton instances of modules as needed;
*/

const MeetupsModule = require('./meetup');
const QuestionsModule = require('./questions');
const UsersModule = require('./users');
const CommentsModule = require('./comments');

let meetupModuleInstance = null;
let questionModuleInstance = null;
let usersModuleInstance = null;
let commentsModuleInstance = null;

const getModule = (moduleName) => {
  switch (moduleName) {
    case 'meetups':
      if (meetupModuleInstance === null) {
        meetupModuleInstance = new MeetupsModule();
      }
      return meetupModuleInstance;
    case 'questions':
      if (questionModuleInstance === null) {
        questionModuleInstance = new QuestionsModule();
      }
      return questionModuleInstance;
    case 'users':
      if (usersModuleInstance === null) {
        usersModuleInstance = new UsersModule();
      }
      return usersModuleInstance;
    case 'comments':
      if (commentsModuleInstance === null) {
        commentsModuleInstance = new CommentsModule();
      }
      return commentsModuleInstance;
    default:
      break;
  }
  return null;
};

module.exports = getModule;
