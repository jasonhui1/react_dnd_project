import React, { useState, useEffect, useRef } from 'react';
import { Todo, NewTodo } from '../types/Todo';
import * as api from '../api';
import { OrderedList, ListItem, Flex, Checkbox, Button, Text, Box } from '@chakra-ui/react';
import { useDrag, useDrop } from "react-dnd";



interface CardProp {
  todo: Todo
  mySectionIndex: number
  myIndex: number //Index in the section
  moveItem: (dragIndex: number, hoverIndex: number, sectionIndex: number) => void
}

// Props for passing between components when dragging and dropping
interface PassProp {
  _id: string
  index: number
}

function Card({ todo, mySectionIndex, myIndex, moveItem }: CardProp) {
  const ref = useRef(null);

  //Drop to todos that are in the same section
  const [_, drop] = useDrop({
    accept: "todo",
    hover(item: PassProp, monitor) {
      if (!ref.current) return

      const dragIndex = item.index;
      const hoverIndex = myIndex;
      if (dragIndex === hoverIndex) return
      
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

        moveItem(dragIndex, hoverIndex, mySectionIndex);
        item.index = hoverIndex;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "todo",
    item: { _id: todo._id, index: myIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <Box key={todo._id} bg='blue.500' w='max(200px,full)' px='5' py='2' opacity={isDragging ? 0.5 : 1} ref={ref}>
      <Flex gap='2' alignItems='center'>
        <Text as='span' color='white'>{todo.title}</Text>
      </Flex>
    </Box>
  );
};


interface SectionProps {
  todos: Todo[],
  section: Section,
  handleDrop: (index: number, _id: string) => void
  myIndex: number,
  moveItem: (dragIndex: number, hoverIndex: number, sectionIndex: number) => void

}
interface XYCoord {
  x: number,
  y: number
}

interface DropSectionProps {
  myIndex: number,
  handleDrop: (index: number, _id: string) => void
  children: React.ReactNode

}

function DropSection({ myIndex, handleDrop, children }: DropSectionProps) {

  //Drop to the section->Add it
  const [{ isOver }, drop] = useDrop({
    accept: "todo",
    drop: (item: PassProp, monitor) => {

      const { _id } = item
      handleDrop(myIndex, _id)

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


function SectionComponent({ todos, section, handleDrop, myIndex, moveItem }: SectionProps) {

  return (
    <DropSection myIndex={myIndex} handleDrop={handleDrop}>
      {
        section.childs.map((child_Id: string, child_index) => {
          const index = todos.findIndex((todo) => todo._id === child_Id);
          if (index !== -1) {
            return (
              <Card key={child_Id} todo={todos[index]} myIndex={child_index} moveItem={moveItem} mySectionIndex={myIndex} />

            )
          }
        })}
    </DropSection>
  );
}

interface Section {
  title: string
  childs: string[]
}

interface TodoStatus extends Todo {
  prevStatus: number
}

export default function Board() {
  const [todos, setTodos] = useState<TodoStatus[]>([]);
  const [sections, setSections] = useState<Section[]>([{ title: 'Element', childs: [] }, { title: 'Anime', childs: ['2'] }])

  useEffect(() => {
    async function fetchTodos() {
      const { data } = await api.fetchTodo();
      setTodos(data);
    }
    fetchTodos()
  }, []);

  // Move the position in the same section
  const moveItem = (dragIndex: number, hoverIndex: number, sectionIndex: number) => {
    //Update child
    const childs = sections[sectionIndex].childs[dragIndex];
    const updateChilds = sections[sectionIndex].childs.filter((_, index) => index !== dragIndex);
    updateChilds.splice(hoverIndex, 0, childs);

    //Update section
    let newSection = [...sections]
    newSection[sectionIndex] = { ...newSection[sectionIndex], childs: updateChilds }

    setSections(newSection);
  };

  //When drop to a new section
  const handleDrop = (sectionIndex: number, _id: string) => {
    let newSections = [...sections];
    const newIndex = todos.findIndex((todo) => todo._id === _id);
    const prevIndex = todos[newIndex].prevStatus;

    // Check if the todo was dropped in the same section
    if (sectionIndex === prevIndex) {
      return;
    }

    // Remove the todo from the previous section's child list
    const removeChildFromSection = (section: number, childId: string) => {
      const filteredChilds = newSections[section].childs.filter((child) => child !== childId);
      newSections[section] = { ...newSections[section], childs: filteredChilds };
    };


    //Add the todo to the new section
    const addChildToSection = (section: number, childId: string) => {
      const currentChilds = newSections[section].childs;
      const newChilds = [...currentChilds, childId];
      newSections[section] = { ...newSections[section], childs: newChilds };
    };


    if (prevIndex !== undefined) {
      removeChildFromSection(prevIndex, todos[newIndex]._id);
    }
    addChildToSection(sectionIndex, todos[newIndex]._id);


    // Update the item's previous status
    setTodos((prevTodos) => prevTodos.map((todo, index) => index === newIndex ? { ...todo, prevStatus: sectionIndex } : todo));

    // Update the sections state
    setSections(newSections);
  };


  return (
    <Flex gap='3'>
      <SectionCards todos={todos} moveItem={moveItem} />
      {
        sections.length >= 0 && sections.map((section, index) => {
          return (
            <Box w='250px' h='500px'>
              <SectionComponent key={index} todos={todos} section={section} handleDrop={handleDrop} myIndex={index} moveItem={moveItem} />

            </Box>
          )
        })
      }
    </Flex>

  )
}

interface SectionCardsProps {
  todos: Todo[]
  moveItem: (dragIndex: number, hoverIndex: number, sectionIndex: number) => void
}


function SectionCards({ todos, moveItem }: SectionCardsProps): JSX.Element {
  return (
    <Flex gap='3' direction='column'>
      {
        todos.map((todo, index) => {
          return (
            <Card key={todo._id} todo={todo} myIndex={index} moveItem={moveItem} mySectionIndex={-1} />
          )
        })
      }
    </Flex>
  )
}