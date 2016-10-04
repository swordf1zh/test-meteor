import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from '../lib/collections';

Meteor.methods({
  newMessage(message) {
    console.info('message', message);

    check(message, {
      text: String,
      type: String,
      chatId: String
    });

    message.timestamp = new Date();

    const messageId = Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  }
});