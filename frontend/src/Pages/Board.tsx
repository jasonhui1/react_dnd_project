import React, { useState, useEffect, useRef } from 'react';
import { Todo, NewTodo } from '../types/Todo';
import * as api from '../api';
import { OrderedList, ListItem, Flex, Checkbox, Button, Text, Box, Heading } from '@chakra-ui/react';
import { useDrag, useDrop } from "react-dnd";



interface CardProp {
  properties: Todo
  positionIndex: number //Index in the section
  sectionIndex: number
  onHoverSwapCard: (dragCardId: string, hoverIndex: number, prevSectionIndex: number, sectionIndex: number) => void
  onDropSwapCard: (dragCardId: string, hoverIndex: number, sectionIndex: number) => void

}

// Props for passing between components when dragging and dropping
interface PassProp {
  _id: string
  index: number
  sectionIndex: number
}

function Card({ properties, positionIndex, sectionIndex, onHoverSwapCard, onDropSwapCard }: CardProp) {
  const ref = useRef(null);

  //Drop to todos that are in the same section
  const [_, drop] = useDrop({
    accept: "todo",
    hover(item: PassProp, monitor) {
      if (!ref.current) return

      const dragIndex = item.index;
      const hoverIndex = positionIndex;
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

        onHoverSwapCard(item._id, hoverIndex, item.sectionIndex, sectionIndex);
        item.index = hoverIndex;
      }
    },
    drop: (item: PassProp, monitor) => {
      const prevSectionIndex = item.sectionIndex
      const newSectionIndex = sectionIndex

      // onDropSwapCard(_id, index, sectionIndex)
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
      <Flex gap='2' alignItems='center'>
        <Text as='span' color='white'>{properties.title}</Text>
      </Flex>
    </Box>
  );
};


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
interface XYCoord {
  x: number,
  y: number
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

function SectionComponent({ properties, positionIndex, handleDrop, onHoverSwapCard, onDropSwapCard, onClickDeleteSection, onClickAddCard, onClickDeleteCard }: SectionProps) {

  return (

    <DropSection positionIndex={positionIndex} handleDrop={handleDrop}>
      <Flex direction='column' justify='space-between' h='full'>
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

          <Button onClick={() => onClickAddCard(properties._id, 'testing')}>Add new card</Button>

        </Box>
        <Button onClick={() => onClickDeleteSection(properties._id)} mt=''> Delete Section</Button>
      </Flex>
    </DropSection>


  );
}

interface Section {
  _id: string
  title: string
  cards: Todo[]
}


export default function Board() {
  const [sections, setSections] = useState<Section[]>([{ _id: 'A', title: 'Element', cards: [] }, { _id: 'B', title: 'Anime', cards: [] }])
  const BOARDID = '64233d206555d18b2cbedd3d'
  //TODO
  //1. Add new board, created by user, with a default section
  //6. Reorder code

  useEffect(() => {
    async function fetchSections() {
      const { data } = await api.fetchBoardById(BOARDID);
      setSections(data.sections);
      console.log('sections', data.sections)
    }

    fetchSections()
  }, []);

  // Move the position in the same section
  //Not added to the database, as it is not certain yet and delay is more obvious
  const onHoverSwapCard = (dragCardId: string, hoverIndex: number, dragSectionIndex: number, sectionIndex: number) => {

    console.log('dragSectionIndex', dragSectionIndex)
    console.log('sectionIndex', sectionIndex)
    
    const prevSectionIndex = sections.findIndex(section => section.cards.some(card => card._id === dragCardId))

    //Swap between current section
    if (prevSectionIndex === sectionIndex) {

      const curSection = sections[sectionIndex]

      const dragIndex = curSection.cards.findIndex(card => card._id === dragCardId)
      const card = curSection.cards[dragIndex];
      const updateCards = curSection.cards.filter((_, index) => index !== dragIndex);
      updateCards.splice(hoverIndex, 0, card);

      //Update section
      let newSection = [...sections]
      newSection[sectionIndex] = { ...newSection[sectionIndex], cards: updateCards }

      setSections(newSection);

    } else {
      //Move to another section
      //Disable it for now
      // if (prevSectionIndex === -1) {console.log('prev section not found'); return}

      // const prevSection=sections[prevSectionIndex]
      // console.log('prevSection', prevSection)
      // // const prevSection = sections[prevSectionIndex]


      // const dragIndex = prevSection.cards.findIndex(card => card._id === dragCardId)
      // console.log('dragIndex', dragIndex)
      // const card = prevSection.cards[dragIndex];
      // const prevUpdateCards = prevSection.cards.filter((_, index) => index !== dragIndex);

      // const curUpdateCards = sections[sectionIndex].cards
      // curUpdateCards.splice(hoverIndex, 0, card)
      // //Update section
      // let newSection = [...sections]
      // newSection[prevSectionIndex] = { ...newSection[prevSectionIndex], cards: prevUpdateCards }
      // newSection[sectionIndex] = { ...newSection[sectionIndex], cards: curUpdateCards }

      // setSections(newSection);


      // console.log('another section', prevSectionIndex, prevUpdateCards, curUpdateCards)
      console.log('another section')

    }
  };


  //Card, index to place in, section to place in
  const onDropSwapCard = (dragCardId: string, hoverIndex: number, sectionIndex: number) => {


    async function changeCardPosition() {
      const { data } = await api.changeCardPosition(BOARDID, dragCardId, hoverIndex, sectionIndex)
      setSections(data.sections)
    }
    changeCardPosition()
  }

  // const swapCardPosition = (dragIndex: number, hoverIndex: number, sectionIndex: number) => {
  //   //Update child
  //   const childs = sections[sectionIndex].cards[dragIndex];
  //   const updateChilds = sections[sectionIndex].cards.filter((_, index) => index !== dragIndex);
  //   updateChilds.splice(hoverIndex, 0, childs);

  //   //Update section
  //   let newSection = [...sections]
  //   newSection[sectionIndex] = { ...newSection[sectionIndex], cards: updateChilds }

  //   setSections(newSection);
  // };

  //When drop to a new section
  //TODO: USe Change Section api
  const handleDrop = (cardId: string, prevIndex: number, currentIndex: number) => {

    if (currentIndex === prevIndex) return;

    async function changeCardSection() {
      const { data } = await api.changeCardSection(BOARDID, cardId, prevIndex, currentIndex)
      setSections(data.sections)
    }
    changeCardSection()


    // let newSections = [...sections];

    // // Check if the todo was dropped in the same section
    // if (currentIndex === prevIndex) {
    //   return;
    // }

    // // Remove the todo from the previous section's child list
    // const removeChildFromSection = (section: number, childId: string) => {
    //   const filteredChilds = newSections[section].cards.filter((child) => child._id !== childId);
    //   newSections[section] = { ...newSections[section], cards: filteredChilds };
    // };


    // //Add the todo to the new section
    // const addChildToSection = (section: number, childId: string) => {
    //   const currentChilds = newSections[section].cards;
    //   const newChilds = [...currentChilds, childId];
    //   newSections[section] = { ...newSections[section], cards: newChilds };
    // };

    // if (prevIndex !== undefined) {
    //   removeChildFromSection(prevIndex, _id);
    // }
    // addChildToSection(currentIndex, _id);


    // // Update the sections state
    // setSections(newSections);
  };


  function onClickAddSection() {
    //Add section to database -> get it
    async function createSection() {
      const { data } = await api.createSection(BOARDID, 'A');
      console.log('data', data.sections)
      setSections(data.sections);
    }

    createSection()
  }

  function onClickDeleteSection(sectionId: string) {
    async function deleteSection() {
      const { data } = await api.deleteSection(BOARDID, sectionId);
      setSections(data.sections);
    }
    deleteSection()
  }

  function onClickAddCard(sectionId: string, title: string) {
    //Add section to database -> get it
    async function createCard() {
      const { data } = await api.createCard(BOARDID, sectionId, title);
      setSections(data.sections);
    }

    createCard()
  }

  function onClickDeleteCard(sectionId: string, cardId: string) {
    async function deleteCard() {
      const { data } = await api.deleteCard(BOARDID, sectionId, cardId);
      setSections(data.sections);
    }
    deleteCard()
  }

  return (
    <Box>
      <Flex gap='3'>
        {
          sections.length >= 0 && sections.map((section, index) => {
            return (
              <Box w='250px' h='500px' key={section._id}>
                <SectionComponent properties={section} positionIndex={index} handleDrop={handleDrop} onHoverSwapCard={onHoverSwapCard} onDropSwapCard={onDropSwapCard} onClickDeleteSection={onClickDeleteSection} onClickAddCard={onClickAddCard} onClickDeleteCard={onClickDeleteCard} />
              </Box>
            )
          })
        }

        <Button onClick={onClickAddSection}> Add Section</Button>

      </Flex>
    </Box>

  )
}
