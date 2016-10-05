import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from '../lib/collections';

Meteor.methods({
  newMessage(message) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to send message.');
    }
    
    check(message, {
      text: String,
      type: String,
      chatId: String
    });

    message.timestamp = new Date();
    message.userId =  this.userId;

    const messageId = Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  },
  
  updateName(name) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update his name.');
    }
    
    check(name, String);
    
    if (name.length === 0) {
      throw Meteor.Error('name-required', 'Must provide a user name');
    }
    
    return Meteor.users.update(this.userId, { $set: { 'profile-name': name } });
  },
  
  newChat(otherId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to create a chat');
    }

    check(otherId, String);

    const otheUser = Meteor.users.findOne(otherId);

    //@todo Este bloque de abajo da un error:
    //    Exception while simulating the effect of invoking 'newChat'
    //    ReferenceError: otherUser is not defined
    //    newChat@http://localhost:3000/app/app.js?hash=8386257e4807988879ed671b975f1318a414a132:1320:11
    //    .apply/stubReturnValue<@http://localhost:3000/packages
    //    ...
//  if (!otherUser) {
//    throw new Meteor.Error('user-not-exists', 
//      'Chat\'s user not exists');
//  }
    
    const chat = {
      userIds: [this.userId, otherId],
      createdAt: new Date()
    };
    
    const chatId = Chats.insert(chat);

    return chatId;
  },
  
  removeChat(chatId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to create a chat');
    }
    
    check(chatId, String);
    
    const chat = Chats.findOne(chatId);
    
    if (!chat || !_.include(chat.userIds, this.userId)) {
      throw new Meteor.Error('chat-not-exists', 
        'Chat not exists');
    }
    
    Messages.remove({ chatId: chatId });
    
    return Chat.remove({ _id: chatId });
  },
  
  updatePicture(data) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to update your picture');
    }
    
    check(data, String);
    
    return Meteor.users.update(this.userId, { $set: { 'profile.picture': data } });
  }
  
});
