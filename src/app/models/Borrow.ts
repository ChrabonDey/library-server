import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  quantity: { type: Number, required: true },
  dueDate: { type: Date, required: true },
});

export default mongoose.model('Borrow', borrowSchema);