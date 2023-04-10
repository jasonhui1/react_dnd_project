import React, { useRef } from 'react';
import { OrderedList, ListItem, Flex, Checkbox, Button, Text, Box, Heading, Input } from '@chakra-ui/react';
import { useDrag, useDrop, DragPreviewImage  } from "react-dnd";
import { Todo } from '../../types/Todo';

interface XYCoord {
    x: number,
    y: number
}

interface CardProp {
    properties: Todo
    positionIndex: number //Index in the section
    sectionIndex: number
    onHover: (dragCardId: string, hoverIndex: number, prevSectionIndex: number, sectionIndex: number) => void
    onDrop: (dragCardId: string, hoverIndex: number, sectionIndex: number) => void
    onDelete: (sectionId: string, cardId: string) => void
}

// Props for passing between components when dragging and dropping
export interface PassProp {
    _id: string
    index: number
    sectionIndex: number
}

export default function Card({ properties, positionIndex, sectionIndex, onHover, onDrop, onDelete }: CardProp) {
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

                onHover(item._id, hoverIndex, item.sectionIndex, sectionIndex);
                item.index = hoverIndex;
            }
        },
        drop: (item: PassProp, monitor) => {
            onDrop(item._id, item.index, sectionIndex)
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

    const onClick = (f:any) => {
        f()
    }
    return (
        <Box bg={isDragging?'gray.800':'blue.500'} w='max(200px,full)' px='5' py='2' rounded={'2xl'} opacity={isDragging ? 0.5 : 1} ref={ref}>
            <Flex justify='space-between' align={'center'}>

                <Text as='span' color='white'>{properties.title}</Text>
                <Button onClick={()=>onClick(onDelete)}>DELETE</Button>
            </Flex>
        </Box>
    );
};