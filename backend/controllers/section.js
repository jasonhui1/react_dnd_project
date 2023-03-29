import { Board } from '../models/board.js';

// '/board/:boardId/sections'
export const createSection = async (req, res) => {
    const { boardId } = req.params;
    const { title } = req.body;
    const newSection = {
        title: title,
        cards: [] // initialize with empty array of cards
    };

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

    Board.findByIdAndUpdate(boardId, { $pull: { sections: { _id: sectionId } } }, { new: true })
        .then((board) => {
            res.status(200).json(board);
        })
        .catch(error => {
            res.status(500).json({ error: "Error deleting section" });
        });
};

// '/boards/:boardId/sections/:sectionId'
export const patchSection = async (req, res) => {
    const { boardId, sectionId } = req.params;
    const { title } = req.body;
    const update = {
        $set: {
            "sections.$.title": title
        }
    };

    Board.findOneAndUpdate({ _id: boardId, "sections._id": sectionId }, update, { new: true })
        .then(board => {
            const section = board.sections.find(s => s._id.toString() === sectionId);
            res.status(200).json(section);
        })
        .catch(error => {
            res.status(500).json({ error: "Error updating section" });
        });
};


export const patchCardSection = async (req, res) => {
    const { boardId } = req.params;
    const { cardId, prevSectionIndex, newSectionIndex } = req.body;



    try {
        const document = await Board.findById(boardId);
        if (!document) throw new Error(`No board found with id: ${boardId}`);

        const cardIndex = document.sections[prevSectionIndex].cards.findIndex(card => card._id.toString()  === cardId)
        let card = document.sections[prevSectionIndex].cards[cardIndex]
        card = card.toObject()
        delete card._id

        document.sections[prevSectionIndex].cards.splice(cardIndex, 1)
        document.sections[newSectionIndex].cards.push(card)

        const updatedDocument = await document.save();
        res.status(200).json(updatedDocument)
    } catch (error) {
        res.status(409).json({ message: "swap fail" })
    }
};
