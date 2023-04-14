import React, { useState, useRef } from 'react';
import { Flex, Button, Box, Heading, Input, Stack, Divider } from '@chakra-ui/react';
import { useDrag, useDrop } from "react-dnd";
import Card, { PassProp } from './Card';
import { Todo } from '../../types/Todo';
import { useBoardContext } from '../../context/board';
import DeleteButton from '../DeleteButton';
import { ItemTypes } from '../../types/ItemType';
import AddForm from '../AddForm';

export interface Section {
    _id: string
    title: string
    cards: Todo[]
}

interface DropSectionProps {
    positionIndex: number,
    children: React.ReactNode
}

interface SectionItemPassProp {
    index: number
}

function DropSection({ positionIndex, children }: DropSectionProps) {
    const ref = useRef(null);

    const { onDropSwapCardSection, onHoverSwapSection } = useBoardContext();

    //Drop to the section->Add it
    const [{ isOver }, drop] = useDrop({
        accept: [ItemTypes.CARD, ItemTypes.SECTION],
        drop: (item: PassProp, monitor) => {
            console.log('monitor.getItemType()', monitor.getItemType())

            if (monitor.getItemType() === ItemTypes.CARD) {
                const didDrop = monitor.didDrop()
                if (didDrop) return //Drop on cards already

                const { _id, sectionIndex } = item
                const prevSectionIndex = sectionIndex
                onDropSwapCardSection(_id, prevSectionIndex, positionIndex,)
            }

            if (monitor.getItemType() === ItemTypes.SECTION) {
                const prevIndex = item.index
                const newIndex = positionIndex

                // onHoverSwapSection(prevIndex, newIndex,)
                //onDrop
            }


        },
        hover(item: SectionItemPassProp, monitor) {
            if (!ref.current) return


            const prevIndex = item.index
            const newIndex = positionIndex
            if (prevIndex === newIndex) return

            // Calculate the middle
            const hoveredRect = (ref.current as Element).getBoundingClientRect();
            const hoverMiddleX = (hoveredRect.right - hoveredRect.left) / 2;
            const mousePosition = monitor.getClientOffset();

            if (mousePosition !== null) {
                const hoverClientX = mousePosition.x - hoveredRect.left;

                //drag is below but less than middle
                if (prevIndex < newIndex && hoverClientX < hoverMiddleX) return;
                //drag is above but less than middle
                if (prevIndex > newIndex && hoverClientX > hoverMiddleX) return;

                onHoverSwapSection(prevIndex, newIndex)
                item.index = newIndex;
            }

        },

        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.SECTION,
        item: { index: positionIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drag(drop(ref));



    return (
        <Flex direction='column' h='calc(100vh)' ref={ref}>

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

                    <AddForm setState={setTitle} onClick={() => onClickAddCard(properties._id, title)} />

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
