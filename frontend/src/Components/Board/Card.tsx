import React, { forwardRef, useRef } from 'react';
import { OrderedList, ListItem, Flex, Checkbox, Button, Text, Box, Heading, Input } from '@chakra-ui/react';
import { useDrag, useDrop, DragPreviewImage } from "react-dnd";
import { Todo } from '../../types/Todo';

import { useBoardContext } from '../../context/board';
import DeleteButton from '../DeleteButton';
import { ItemTypes } from '../../types/ItemType';

interface XYCoord {
    x: number,
    y: number
}

interface CardProp {
    properties: Todo
    positionIndex: number //Index in the section
    sectionIndex: number
    onDelete: (sectionId: string, cardId: string) => void
    onSwap: (index1: number, index2: number) => void
}

// Props for passing between components when dragging and dropping
export interface PassProp {
    _id: string
    index: number
    sectionIndex: number
}

const Card = forwardRef<HTMLLIElement, CardProp>(
    ({ properties, positionIndex, sectionIndex, onDelete, onSwap }, ref) => {
        const cardRef = useRef(null);
        const { onHoverSwapCard, onDropSwapCardPosition } = useBoardContext();

        //Drop the card on the card that is in the same section
        const [_, drop] = useDrop({
            accept: ItemTypes.CARD,
            hover(item: PassProp, monitor) {
                if (!cardRef.current) return

                const dragIndex = item.index;
                const hoverIndex = positionIndex;
                if (dragIndex === hoverIndex && sectionIndex === item.sectionIndex) return

                // Calculate the middle
                const hoveredRect = (cardRef.current as Element).getBoundingClientRect();
                const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
                const mousePosition: XYCoord | null = monitor.getClientOffset();

                if (mousePosition !== null) {
                    const hoverClientY = mousePosition.y - hoveredRect.top;

                    //drag is below but less than middle
                    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
                    //drag is above but less than middle
                    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

                    onHoverSwapCard(item._id, hoverIndex, sectionIndex);
                    onSwap(hoverIndex, dragIndex)
                    item.index = hoverIndex;
                    item.sectionIndex = sectionIndex
                }
            },
            drop: (item: PassProp, monitor) => {
                onDropSwapCardPosition(item._id, item.index, sectionIndex)
            },
        });

        const [{ isDragging }, drag] = useDrag({
            type: ItemTypes.CARD,
            item: { _id: properties._id, index: positionIndex, sectionIndex: sectionIndex },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        drag(drop(cardRef));

        const onClick = (f: any) => {
            f()
        }
        return (
            <Box
                // bg={isDragging ? 'gray.800' : 'blue.500'} 
                bg='blue.500'
                w='max(200px,full)' px='5' py='2' rounded={'2xl'}
                // opacity={isDragging ? 0.5 : 1} 
                ref={(el) => {
                    cardRefz.current = el;
                    ref.current = el;
                }}>
                <Flex align={'center'} >

                    <Text as='span' color='white'>{properties.title}</Text>
                    <DeleteButton onClick={() => onClick(onDelete)} />
                </Flex>
            </Box >
        );
    });
export default Card
