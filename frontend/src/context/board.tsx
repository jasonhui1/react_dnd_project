import { createContext, useContext } from 'react';

interface BoardProps {
    handleDrop: (_id: string, prevSectionIndex: number, index: number,) => void
    onHoverSwapCard: (dragCardId: string, hoverIndex: number, prevSectionIndex: number, sectionIndex: number) => void
    onDropSwapCard: (dragCardId: string, hoverIndex: number, sectionIndex: number) => void
    onClickDeleteSection: (id: string) => void
    onClickAddCard: (sectionId: string, title: string) => void
    onClickDeleteCard: (sectionId: string, cardId: string) => void
}

// Create the context
const BoardContext = createContext<BoardProps>({
    handleDrop: () => { },
    onHoverSwapCard: () => { },
    onDropSwapCard: () => { },
    onClickDeleteSection: () => { },
    onClickAddCard: () => { },
    onClickDeleteCard: () => { },
});

interface Props extends BoardProps {
    children: React.ReactNode
}

// Define the provider component
export const BoardContextProvider = ({ handleDrop, onHoverSwapCard, onDropSwapCard, onClickDeleteSection, onClickAddCard, onClickDeleteCard, children }: Props) => {


    // Pass all the functions in the context value object
    const contextValue = {
        handleDrop,
        onHoverSwapCard,
        onDropSwapCard,
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
