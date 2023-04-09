import React, { useState } from 'react';
import { Flex, Button, Box, Heading, Input } from '@chakra-ui/react';
import { useDrop } from "react-dnd";
import Card, { PassProp } from './Card';
import { Todo } from '../../types/Todo';


interface SectionProps {
    properties: Section,
    positionIndex: number,
    handleDrop: (_id: string, prevSectionIndex: number, index: number,) => void
    onHoverSwapCard: (dragCardId: string, hoverIndex: number, prevSectionIndex: number, sectionIndex: number) => void
    onDropSwapCard: (dragCardId: string, hoverIndex: number, sectionIndex: number) => void
    onClickDeleteSection: (id: string) => void
    onClickAddCard: (sectionId: string, title: string) => void
    onClickDeleteCard: (sectionId: string, cardId: string) => void

}

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

export default function SectionComponent({ properties, positionIndex, handleDrop, onHoverSwapCard, onDropSwapCard, onClickDeleteSection, onClickAddCard, onClickDeleteCard }: SectionProps) {

    const [title, setTitle] = useState('')

    return (
        <DropSection positionIndex={positionIndex} handleDrop={handleDrop}>
            <Flex direction='column' justify='space-between' h='full' p='3'>
                <Box>
                    <Heading>{properties.title}</Heading>

                    {
                        properties.cards.map((card: Todo, index) => (
                            <Flex key={card._id} justify='space-between'>

                                <Card properties={card} positionIndex={index} sectionIndex={positionIndex} onHoverSwapCard={onHoverSwapCard} onDropSwapCard={onDropSwapCard} />
                                <Button onClick={() => onClickDeleteCard(properties._id, card._id)}>DELETE</Button>

                            </Flex>
                        ))
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