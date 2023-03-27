import mongoose from 'mongoose';


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

const SectionMessage = mongoose.model('Section', SectionSchema);

export default SectionMessage;
