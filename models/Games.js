import { Schema, model } from 'mongoose';

const GameSchema = new Schema({
  name: String,
  password: String,
  timestamp: { type: Date, default: Date.now },
  users : [{
      color: String,
      name: String, 
      socketId: String
  }],
  pieces: [{
    type: String,
    color: String,
    case: String
  }]
});

const Message = model('Game', GameSchema);

export default Message;