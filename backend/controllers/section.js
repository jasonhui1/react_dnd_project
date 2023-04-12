import { Board } from '../models/board.js';

// '/board/:boardId/sections'
export const createSection = async (req, res) => {
    const { boardId } = req.params;
    const { title } = req.body;
    const userId = req.userId

    const newSection = {
        title: title,
        cards: [] // initialize with empty array of cards
    };

    try {
        const board = await Board.findOneAndUpdate(
            { _id: boardId, createdBy: userId },
            { $push: { sections: newSection } },
            { new: true }
        );
        res.status(201).json(board);
    } catch (err) {
        res.status(500).json(err);
    }

    Board.findByIdAndUpdate(boardId, { $push: { sections: newSection } }, { new: true })
        .then(board => {
            res.status(201).json(board);
            // res.status(201).json(board.sections[board.sections.length - 1]);
        })
        .catch(error => {
            res.status(500).json({ error: "Error adding new section" });
        });
};


// '/boards/:boardId/sections/:sectionId'
export const deleteSection = async (req, res) => {
    const { boardId, sectionId } = req.params;
    const userId = req.userId

    try {
        const board = await Board.findOneAndUpdate(
            { _id: boardId, createdBy: userId },
            { $pull: { sections: { _id: sectionId } } },
            { new: true }
        );

        res.status(200).json(board);
    } catch (err) {
        res.status(500).json({ error: "Error deleting section" });
    }
};

// '/boards/:boardId/sections/:sectionId'
export const patchSection = async (req, res) => {
    const { boardId, sectionId } = req.params;
    const { title } = req.body;
    const userId = req.userId

    const update = {
        $set: {
            "sections.$.title": title
        }
    };

    try {
        const board = await Board.findOneAndUpdate(
            { _id: boardId, createdBy: userId, "sections._id": sectionId },
            update,
            { new: true }
        );

        res.status(200).json(board);
    } catch (err) {
        res.status(500).json({ error: "Error patching section" });
    }
};


//Drop card to a new section
export const patchCardSection = async (req, res) => {
    const { boardId } = req.params;
    const { cardId, prevSectionIndex, newSectionIndex } = req.body;
    const userId = req.userId

    try {
        const document = await Board.findById(boardId).where('createdBy').equals(userId);
        if (!document) throw new Error(`No board found with id: ${boardId}`);

        const cardIndex = document.sections[prevSectionIndex].cards.findIndex(card => card._id.toString() === cardId)
        let card = document.sections[prevSectionIndex].cards[cardIndex]
        card = card.toObject() //cannot push with existing _id
        delete card._id

        document.sections[prevSectionIndex].cards.splice(cardIndex, 1)
        document.sections[newSectionIndex].cards.push(card)

        const updatedDocument = await document.save();
        res.status(200).json(updatedDocument)
    } catch (error) {
        res.status(409).json({ message: "swap fail" })
    }
};

//Drop card to a new position
export const swapCard = async (req, res) => {

    const { boardId } = req.params;
    const { cardId, newIndex, sectionIndex } = req.body;
    const userId = req.userId

    try {
        const document = await Board.findById(boardId).where('createdBy').equals(userId);
        if (!document) throw new Error(`No document found with id: ${boardId}`);
        // if (document.sections[section_id].length <= index1 || document.childs.length <= index2) throw new Error(`index exceeds length`);

        //Get card
        const prevSectionIndex = document.sections.findIndex(section => section.cards.some(card => card._id.toString() === cardId))
        const currentCardIndex = document.sections[prevSectionIndex].cards.findIndex(card => card._id.toString() === cardId)
        let card = document.sections[prevSectionIndex].cards[currentCardIndex];
        card = card.toObject() //cannot push with existing _id
        delete card._id

        //Swap
        document.sections[prevSectionIndex].cards.splice(currentCardIndex, 1)
        document.sections[sectionIndex].cards.splice(newIndex, 0, card)

        // Save the updated document
        const updatedDocument = await document.save();
        res.status(200).json(updatedDocument)
    } catch (error) {
        res.status(409).json({ message: "swap fail" })
    }
}
