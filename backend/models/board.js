import mongoose from 'mongoose';


const BoardSchema = new mongoose.Schema({
  sections: {
    type: [mongoose.Schema.Types.ObjectId],
    ref:'Section',
    default: [],
  },


});

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  childs: {
    type: [String],
    default: [],
  },
});

export const Section = mongoose.model('Section', SectionSchema);
export const Board = mongoose.model('Board', BoardSchema);

