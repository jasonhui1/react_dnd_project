import React, { useRef } from 'react';
import { Flex, Text, Box, Button, } from '@chakra-ui/react';
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
    onHover: (dragCardId: string, hoverIndex: number, prevSectionIndex: number, sectionIndex: number) => void
    onDrop: (dragCardId: string, hoverIndex: number, sectionIndex: number) => void

    onClickDeleteCard: (sectionId: string, cardId: string) => void

}

interface DroppableCardProp {
    properties: Todo
    positionIndex: number //Index in the section
    sectionIndex: number
    onHover: (dragCardId: string, hoverIndex: number, prevSectionIndex: number, sectionIndex: number) => void
    onDrop: (dragCardId: string, hoverIndex: number, sectionIndex: number) => void

    children?: React.ReactNode
}


interface DroppableEmptyCardProp {
    properties: Todo
    positionIndex: number //Index in the section
    sectionIndex: number
    onHover: (dragCardId: string, hoverIndex: number, prevSectionIndex: number, sectionIndex: number) => void
    onDrop: (dragCardId: string, hoverIndex: number, sectionIndex: number) => void

    dragIndex:number

}

// Props for passing between components when dragging and dropping
export interface PassProp {
    _id: string
    index: number
    sectionIndex: number
}

export function DroppableEmptyCard({ properties, dragIndex, positionIndex, sectionIndex, onHover, onDrop,  }: DroppableEmptyCardProp) {
    const ref = useRef(null);

    //Drop to todos that are in the same section
    const [{ isOver }, drop] = useDrop({

        accept: "todo",
        hover(item: PassProp, monitor) {
            console.log('dragIndex, positionIndex', dragIndex, positionIndex)

            if (!ref.current) return
            // onHover(item._id, positionIndex, item.sectionIndex, sectionIndex);
        },
        drop: (item: PassProp, monitor) => {
            onDrop(item._id, item.index, sectionIndex)
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    drop(ref)
    return (
        <Box h='2rem' bg='gray.200' ref={ref} />

    );
}


export function DroppableCard({ properties, positionIndex, sectionIndex, onHover, onDrop, children }: DroppableCardProp) {

    const ref = useRef(null);

    //Drop to todos that are in the same section
    const [_, drop] = useDrop({
        accept: "todo",
        hover(item: PassProp, monitor) {
            if (!ref.current) return

            const hoverIndex = positionIndex;
            const dragIndex=item.index

            if (dragIndex === hoverIndex) return

            // Calculate the middle
            const hoveredRect = (ref.current as Element).getBoundingClientRect();
            const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
            const mousePosition: XYCoord | null = monitor.getClientOffset();

            if (mousePosition !== null) {
                const hoverClientY = mousePosition.y - hoveredRect.top;

                //drag is below but less than middle
                if (dragIndex && dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
                //drag is above but less than middle
                if (dragIndex && dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

                onHover(item._id, hoverIndex, item.sectionIndex, sectionIndex);
                item.index = hoverIndex;
            }
        },
        drop: (item: PassProp, monitor) => {
            const prevSectionIndex = item.sectionIndex
            const newSectionIndex = sectionIndex

            onDrop(item._id, item.index , sectionIndex)
            // console.log(prevSectionIndex, newSectionIndex)
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
        <Box bg='blue.500' w='max(200px,full)' opacity={isDragging ? 0.5 : 1} ref={ref}>
            {children}

        </Box>
    );
}

export default function Card({ properties, positionIndex, sectionIndex, onHover, onDrop, onClickDeleteCard }: CardProp) {

    return (
        <DroppableCard properties={properties} positionIndex={positionIndex} sectionIndex={sectionIndex}
            onHover={onHover}
            onDrop={onDrop}>

            <Flex gap='2' justify='space-between' align={'center'}>
                <Text as='span' color='white'>{properties.title}</Text>
                <Button onClick={() => onClickDeleteCard}>DELETE</Button>

            </Flex>
        </DroppableCard>

    );
};