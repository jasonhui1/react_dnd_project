import React, { useRef } from 'react';
import { OrderedList, ListItem, Flex, Checkbox, Button, Text, Box, Heading, Input } from '@chakra-ui/react';
import { useDrag, useDrop } from "react-dnd";
import { Todo } from '../../types/Todo';

interface XYCoord {
    x: number,
    y: number
}

interface CardProp {
    properties: Todo
    positionIndex: number //Index in the section
    sectionIndex: number
    onHoverSwapCard: (dragCardId: string, hoverIndex: number, prevSectionIndex: number, sectionIndex: number) => void
    onDropSwapCard: (dragCardId: string, hoverIndex: number, sectionIndex: number) => void

}

// Props for passing between components when dragging and dropping
export interface PassProp {
    _id: string
    index: number
    sectionIndex: number
}

export default function Card({ properties, positionIndex, sectionIndex, onHoverSwapCard, onDropSwapCard }: CardProp) {
    const ref = useRef(null);

    //Drop to todos that are in the same section
    const [_, drop] = useDrop({
        accept: "todo",
        hover(item: PassProp, monitor) {
            if (!ref.current) return

            const dragIndex = item.index;
            const hoverIndex = positionIndex;
            if (dragIndex === hoverIndex && sectionIndex === item.sectionIndex) return

            // Calculate the middle
            const hoveredRect = (ref.current as Element).getBoundingClientRect();
            const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
            const mousePosition: XYCoord | null = monitor.getClientOffset();

            if (mousePosition !== null) {
                const hoverClientY = mousePosition.y - hoveredRect.top;

                //drag is below but less than middle
                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
                //drag is above but less than middle
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

                onHoverSwapCard(item._id, hoverIndex, item.sectionIndex, sectionIndex);
                item.index = hoverIndex;
            }
        },
        drop: (item: PassProp, monitor) => {
            const prevSectionIndex = item.sectionIndex
            const newSectionIndex = sectionIndex

            onDropSwapCard(item._id, item.index, sectionIndex)
            console.log(prevSectionIndex, newSectionIndex)
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: "todo",
        item: { _id: properties._id, index: positionIndex, sectionIndex: sectionIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <Box bg='blue.500' w='max(200px,full)' px='5' py='2' opacity={isDragging ? 0.5 : 1} ref={ref}>
            <Flex gap='2'>
                <Text as='span' color='white'>{properties.title}</Text>
            </Flex>
        </Box>
    );
};