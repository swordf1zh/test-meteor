import { Meteor } from 'meteor/meteor';

Meteor.publish('users', () => {
  return Meteor.users.find({}, { fields: { profile: 1 } });
});

Meteor.publishComposite('chats', () => {
  if (!this.userId) return;
  
  return {
    find() {
      return Chats.find({ userIds: this.userId });
    },
    children: [
      {
        find(chat) {
          return Messages.find({ chatId: chat._id });
        }
      },
      {
        find(chat) {
          const query = { _id: { $in: chat.userIds } };
          const options = { fields: { profile: 1 } };
          
          return Meteors.users.find(query, options);
        }
      }
    ]
  };
});
