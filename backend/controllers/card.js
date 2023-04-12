import { Board } from '../models/board.js';


export const createCard = async (req, res) => {
  const { boardId, sectionId } = req.params;
  const { title } = req.body;
  const userId = req.userId

  try {
    const board = await Board.findById(boardId).where('createdBy').equals(userId);
    const section = board.sections.id(sectionId);

    const newCard = {
      title:title,
    };

    section.cards.push(newCard);
    await board.save();

    res.status(201).json(board);
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a card
//'/boards/:boardId/sections/:sectionId/cards/:cardId'
export const deleteCard = async (req, res) => {
  const { boardId, sectionId, cardId } = req.params;
  const userId = req.userId

  try {
    const result = await Board.findOneAndUpdate(
      {_id:boardId, createdBy:userId},
      { $pull: { 'sections.$[].cards': { _id: cardId } } },
      { new: true }
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update a card
//'/boards/:boardId/sections/:sectionId/cards/:cardId'
export const patchCard = async (req, res) => {
  const { boardId, sectionId, cardId } = req.params;
  const {title} = req.body
  const userId = req.userId


  try {
    const board = await Board.findById(boardId).where('createdBy').equals(userId);
    const section = board.sections.id(sectionId);
    const card = section.cards.id(cardId);

    Object.assign(card, title);
    await board.save();

    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ message: 'Card not found' });
  }
};