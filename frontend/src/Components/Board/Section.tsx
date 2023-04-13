import React, { useState } from 'react';
import { Flex, Button, Box, Heading, Input, Stack, Divider } from '@chakra-ui/react';
import { useDrop } from "react-dnd";
import Card, { PassProp } from './Card';
import { Todo } from '../../types/Todo';
import { useBoardContext } from '../../context/board';
import DeleteButton from '../DeleteButton';
import AddButton from '../AddButton';
import { ItemTypes } from '../../types/ItemType';

export interface Section {
    _id: string
    title: string
    cards: Todo[]
}

interface DropSectionProps {
    positionIndex: number,
    children: React.ReactNode
}

function DropSection({ positionIndex, children }: DropSectionProps) {

    const { handleDrop } = useBoardContext();

    //Drop to the section->Add it
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: (item: PassProp, monitor) => {
            const didDrop = monitor.didDrop()
            if (didDrop) return //Drop on cards already

            const { _id, sectionIndex } = item
            const prevSectionIndex = sectionIndex
            handleDrop(_id, prevSectionIndex, positionIndex,)

        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });


    return (
        <Flex direction='column' h='calc(100vh)' ref={drop}>

            <Box
                w="full"
                bg="red.500"
                opacity={isOver ? 0.5 : 1}
                rounded={'3xl'}
            >
                {children}
            </Box>
        </Flex>
    );
}

interface SectionProps {
    properties: Section,
    positionIndex: number,
}

export default function SectionComponent({ properties, positionIndex }: SectionProps) {

    const [title, setTitle] = useState('')
    const { onClickDeleteSection, onClickAddCard } = useBoardContext();

    return (
        <DropSection positionIndex={positionIndex}>
            <Flex direction='column' justify='space-between' h='full' p='3'>
                <Box>
                    <Flex gap='2' mt='5' mb='1' align='center'>

                        <Heading as='h2' size={'lg'}>{properties.title}</Heading>
                        <DeleteButton onClick={() => onClickDeleteSection(properties._id)} />

                    </Flex>
                    <Divider my={5} />
                    <CardList section={properties} positionIndex={positionIndex} />

                    <Flex gap='2' mt='5' mb='1' align='center'>

                        <Input type="text" bg='white' onChange={(e) => setTitle(e.target.value)} />
                        <AddButton onClick={() => onClickAddCard(properties._id, title)} />

                    </Flex>

                </Box>
            </Flex>
        </DropSection>


    );
}

interface CardListsProps {
    section: Section,
    positionIndex: number,
}

function CardList({ section, positionIndex }: CardListsProps) {
    const { onClickDeleteCard } = useBoardContext();

    return (
        <Stack gap={1}>
            {
                section.cards.map((card: Todo, index) => {
                    return (
                        <Card key={card._id} properties={card} positionIndex={index} sectionIndex={positionIndex}
                            onDelete={() => onClickDeleteCard(section._id, card._id)} />

                    )
                })
            }
        </Stack>
    )
}
