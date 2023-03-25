import mongoose from 'mongoose';


const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  creater_ID:{
    type:String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const TodoMessage = mongoose.model('Todo', TodoSchema);

export default TodoMessage;
