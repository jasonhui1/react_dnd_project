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
  sectionIndex:number
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
    item: { _id: todo._id, index: myIndex, sectionIndex: mySectionIndex },
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
  handleDrop:(_id: string, prevSectionIndex:number, index: number, ) => void
  myIndex: number,
  moveItem: (dragIndex: number, hoverIndex: number, sectionIndex: number) => void

}
interface XYCoord {
  x: number,
  y: number
}

interface DropSectionProps {
  myIndex: number,
  handleDrop: (_id: string, prevSectionIndex:number, index: number, ) => void
  children: React.ReactNode

}

function DropSection({ myIndex, handleDrop, children }: DropSectionProps) {

  //Drop to the section->Add it
  const [{ isOver }, drop] = useDrop({
    accept: "todo",
    drop: (item: PassProp, monitor) => {

      const { _id, sectionIndex } = item
      const prevSectionIndex = sectionIndex
      handleDrop(_id, prevSectionIndex,  myIndex,)

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
  _id:string
  title: string
  childs: string[]
}

interface TodoStatus extends Todo {
  prevStatus: number
}

export default function Board() {
  const [todos, setTodos] = useState<TodoStatus[]>([]);
  const [sections, setSections] = useState<Section[]>([{ _id:'A', title: 'Element', childs: [] }, { _id:'B' ,title: 'Anime', childs: ['2'] }])

  //TODO
  //1. Add new board, created by user, with a default section
  //2. Update section when drag and drop (handle drop)
  //3. Update section order when changed order (move item)
  //4. Add new card -> add to current section
  //5. Add new section -> add to current board
  //6. Reorder code

  useEffect(() => {
    async function fetchTodos() {
      const { data } = await api.fetchTodo();
      setTodos(data);
    }
    fetchTodos()

    async function fetchSections() {
      const { data } = await api.fetchBoard();
      setSections(data.sections);
      console.log('sections', data.sections)
    }

    fetchSections()
  }, []);

  // Move the position in the same section
  //TODO: Use Swap Child api
  const moveItem = (dragIndex: number, hoverIndex: number, sectionIndex: number) => {
    //Update child

    //Does not work as intended - has delay
    // async function swapChild() {
    //   const {data}  = await api.swapChild(sections[sectionIndex]._id, dragIndex, hoverIndex);
    //   console.log('data', data)
    //   let newSections = [...sections]
    //   newSections[sectionIndex] = data

    //   console.log('data', data)


    //   setSections(newSections);
    //   console.log('newSections', newSections)
    // }

    // swapChild()

    const childs = sections[sectionIndex].childs[dragIndex];
    const updateChilds = sections[sectionIndex].childs.filter((_, index) => index !== dragIndex);
    updateChilds.splice(hoverIndex, 0, childs);

    //Update section
    let newSection = [...sections]
    newSection[sectionIndex] = { ...newSection[sectionIndex], childs: updateChilds }

    setSections(newSection);
  };

  //When drop to a new section
  //TODO: USe Change Section api
  const handleDrop = ( _id: string, prevIndex:number, currentIndex: number) => {
    let newSections = [...sections];
    const newIndex = todos.findIndex((todo) => todo._id === _id);

    // Check if the todo was dropped in the same section
    if (currentIndex === prevIndex) {
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
    addChildToSection(currentIndex, todos[newIndex]._id);


    // Update the sections state
    setSections(newSections);
  };


  const onClickSave = ()=>{
    //Send sections to api
    async function updateBoard() {

      // const section_ids
      const { data } = await api.updateBoard(sections);
      console.log('sections', sections)
    }
    updateBoard()
  }

  return (
    <Flex gap='3'>
      {/* <SectionCards todos={todos} moveItem={moveItem} /> */}
      {
        sections.length >= 0 && sections.map((section, index) => {
          return (
            <Box w='250px' h='500px'>
              <SectionComponent key={index} todos={todos} section={section} handleDrop={handleDrop} myIndex={index} moveItem={moveItem} />

            </Box>
          )
        })
      }
        <Button onClick={onClickSave}> Save


        </Button>
    </Flex>

  )
}

// interface SectionCardsProps {
//   todos: Todo[]
//   moveItem: (dragIndex: number, hoverIndex: number, sectionIndex: number) => void
// }


// function SectionCards({ todos, moveItem }: SectionCardsProps): JSX.Element {
//   return (
//     <Flex gap='3' direction='column'>
//       {
//         todos.map((todo, index) => {
//           return (
//             <Card key={todo._id} todo={todo} myIndex={index} moveItem={moveItem} mySectionIndex={-1} />
//           )
//         })
//       }
//     </Flex>
//   )
// }
