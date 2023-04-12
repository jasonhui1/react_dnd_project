import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
});

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  cards: [CardSchema]
});

const BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  sections: [SectionSchema],
  createdBy: {
    type: String
  }
});


export const Board = mongoose.model('Board', BoardSchema);

