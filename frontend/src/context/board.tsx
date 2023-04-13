import { createContext, useContext } from 'react';

interface BoardProps {
    onHoverSwapCard: (cardId: string, newIndex: number, newSectionIndex: number) => void
    onDropSwapCardPosition: (cardId: string, newPositionIndex: number, currentSectionIndex: number) => void
    onDropSwapCardSection: (cardId: string, prevSectionIndex: number, currentSectionIndex: number)  => void
    onClickDeleteSection: (id: string) => void
    onClickAddCard: (sectionId: string, title: string) => void
    onClickDeleteCard: (sectionId: string, cardId: string) => void
}

// Create the context
const BoardContext = createContext<BoardProps>({
    onHoverSwapCard: () => { },
    onDropSwapCardPosition: () => { },
    onDropSwapCardSection: () => { },
    onClickDeleteSection: () => { },
    onClickAddCard: () => { },
    onClickDeleteCard: () => { },
});

interface Props extends BoardProps {
    children: React.ReactNode
}

// Define the provider component
export const BoardContextProvider = ({onHoverSwapCard, onDropSwapCardPosition, onDropSwapCardSection, onClickDeleteSection, onClickAddCard, onClickDeleteCard, children }: Props) => {

    // Pass all the functions in the context value object
    const contextValue = {
        onHoverSwapCard,
        onDropSwapCardPosition,
        onDropSwapCardSection,
        onClickDeleteSection,
        onClickAddCard,
        onClickDeleteCard,
    };

    return (
        // <BoardContext.Provider value={contextValue}>
        <BoardContext.Provider value={contextValue}>
            {children}
        </BoardContext.Provider>
    );
};

// Define a custom hook to access the context
export const useBoardContext = () => {
    return useContext(BoardContext);
};
