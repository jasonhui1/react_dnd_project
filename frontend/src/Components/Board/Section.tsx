import React, { useState } from 'react';
import { Flex, Button, Box, Heading, Input } from '@chakra-ui/react';
import { useDrop } from "react-dnd";
import Card, { DroppableCard, DroppableEmptyCard, PassProp } from './Card';
import { Todo } from '../../types/Todo';
import { statusInfo } from '../../Pages/Board';

interface DropSectionProps {
    positionIndex: number,
    handleDrop: (_id: string, prevSectionIndex: number, index: number,) => void
    children: React.ReactNode

}

function DropSection({ positionIndex, handleDrop, children }: DropSectionProps) {

    //Drop to the section->Add it
    const [{ isOver }, drop] = useDrop({
        accept: "todo",
        drop: (item: PassProp, monitor) => {

            const { _id, sectionIndex } = item
            const prevSectionIndex = sectionIndex
            handleDrop(_id, prevSectionIndex, positionIndex,)

        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });


    return (
        <Box
            w="full"
            h="full"
            bg="red.500"
            opacity={isOver ? 0.5 : 1}
            ref={drop}
        >
            {children}
        </Box>
    );
}



interface SectionProps {
    properties: Section,
    positionIndex: number,
    handleDrop: (_id: string, prevSectionIndex: number, index: number,) => void
    onHoverSwapCard: (dragCardId: string, hoverIndex: number, prevSectionIndex: number, sectionIndex: number, direction: string) => void
    onDropSwapCard: (dragCardId: string, hoverIndex: number, sectionIndex: number) => void
    onClickDeleteSection: (id: string) => void
    onClickAddCard: (sectionId: string, title: string) => void
    onClickDeleteCard: (sectionId: string, cardId: string) => void

    draggingInfo: statusInfo | null
    hoveringInfo: statusInfo | null
    direction: string
}

export default function SectionComponent({ properties, positionIndex, handleDrop, onHoverSwapCard, onDropSwapCard, onClickDeleteSection, onClickAddCard, onClickDeleteCard, draggingInfo, hoveringInfo, direction }: SectionProps) {

    const [title, setTitle] = useState('')

    const down = direction === 'down'
    console.log('down', down)

    return (
        <DropSection positionIndex={positionIndex} handleDrop={handleDrop}>
            <Flex direction='column' justify='space-between' h='full' p='3'>
                <Box>
                    <Heading>{properties.title}</Heading>

                    {
                        properties.cards.map((card: Todo, index) => {


                            let currentPositionIndex = index
                            if (draggingInfo && hoveringInfo) {
                                if (draggingInfo.cardIndex > index && hoveringInfo.cardIndex < index) {
                                    currentPositionIndex += 1
                                }
                                if (draggingInfo.cardIndex < index && hoveringInfo.cardIndex > index) {
                                    currentPositionIndex -= 1
                                }
                            }
                            const hovering = hoveringInfo?.sectionIndex === positionIndex && hoveringInfo.cardIndex === currentPositionIndex
                            const dragging = draggingInfo?.sectionIndex === positionIndex && draggingInfo.cardIndex === currentPositionIndex
                            return (

                                <>
                                    {hovering && !down &&
                                        <DroppableEmptyCard key='block' properties={card} positionIndex={currentPositionIndex} sectionIndex={positionIndex}
                                            onHover={onHoverSwapCard}
                                            onDrop={onDropSwapCard}
                                            dragIndex={hoveringInfo.cardIndex}
                                        />
                                    }
                                    {!dragging && (
                                        <Card key={card._id} properties={card} positionIndex={currentPositionIndex} sectionIndex={positionIndex}
                                            onHover={onHoverSwapCard}
                                            onDrop={onDropSwapCard}
                                            onClickDeleteCard={() => onClickDeleteCard(properties._id, card._id)}

                                        />
                                    )}
                                    {hovering && down &&
                                        <DroppableEmptyCard key='block' properties={card} positionIndex={currentPositionIndex} sectionIndex={positionIndex}
                                            onHover={onHoverSwapCard}
                                            onDrop={onDropSwapCard}
                                            dragIndex={hoveringInfo.cardIndex}
                                        />

                                    }

                                </>
                            )
                        })
                    }
                    <Input w='full' type="text" bg='white' mt='5' mb='1' onChange={(e) => setTitle(e.target.value)} />
                    <Button onClick={() => onClickAddCard(properties._id, title)}>Add new card</Button>

                </Box>
                <Button onClick={() => onClickDeleteSection(properties._id)} mt=''> Delete Section</Button>
            </Flex>
        </DropSection>


    );
}

export interface Section {
    _id: string
    title: string
    cards: Todo[]
}

interface DNDCards extends Todo {
    dragging?: boolean;
    hovering?: boolean;
}