import React, { useState } from 'react';
import { Flex, Button, Box, Heading, Input, Stack, Divider } from '@chakra-ui/react';
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
                    <Heading as='h2' size={'lg'}>{properties.title}</Heading>
                    <Divider my={5}/>
                    <CardList properties={properties} positionIndex={positionIndex} onHoverSwapCard={onHoverSwapCard} onDropSwapCard={onDropSwapCard} onClickDeleteCard={onClickDeleteCard} />
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


interface CardListsProps {
    properties: Section,
    positionIndex: number,
    onHoverSwapCard: (dragCardId: string, hoverIndex: number, prevSectionIndex: number, sectionIndex: number) => void
    onDropSwapCard: (dragCardId: string, hoverIndex: number, sectionIndex: number) => void
    onClickDeleteCard: (sectionId: string, cardId: string) => void
}

function CardList({ properties, positionIndex, onHoverSwapCard, onDropSwapCard, onClickDeleteCard }: CardListsProps) {
    return (
        <Stack gap={1}>
            {
                properties.cards.map((card: Todo, index) => {
                    return (
                        <Card key={card._id} properties={card} positionIndex={index} sectionIndex={positionIndex}
                            onHover={onHoverSwapCard}
                            onDrop={onDropSwapCard}
                            onDelete={() => onClickDeleteCard(properties._id, card._id)} />

                    )
                })
            }
        </Stack>
    )
}
