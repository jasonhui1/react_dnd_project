import React, { useState, useEffect, useRef } from 'react';
import * as api from '../api';
import { OrderedList, ListItem, Flex, Checkbox, Button, Text, Box, Heading, Input } from '@chakra-ui/react';
import SectionComponent, { Section } from '../Components/Board/Section';


export default function Board() {
  const [sections, setSections] = useState<Section[]>([{ _id: 'A', title: 'Element', cards: [] }, { _id: 'B', title: 'Anime', cards: [] }])
  const [newSectionTitle, setNewSectionTitle] = useState('')


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
  const onHoverSwapCard = (dragCardId: string, hoverIndex: number, dragSectionIndex: number, newSectionIndex: number) => {

    // Find previous indexes
    const prevSectionIndex = sections.findIndex(section => section.cards.some(card => card._id === dragCardId))
    const prevCardIndex = sections[prevSectionIndex].cards.findIndex(card => card._id === dragCardId)
    const updateSections = [...sections]

    const card = sections[prevSectionIndex].cards[prevCardIndex];
    // Update
    updateSections[prevSectionIndex].cards = updateSections[prevSectionIndex].cards.filter(card => card._id !== dragCardId);
    updateSections[newSectionIndex].cards.splice(hoverIndex, 0, card);

    //Update section
    setSections(updateSections);
  };


  //Card, index to place in, section to place in
  const onDropSwapCard = async (dragCardId: string, hoverIndex: number, sectionIndex: number) => {

    const { data } = await api.changeCardPosition(BOARDID, dragCardId, hoverIndex, sectionIndex)
    setSections(data.sections)
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

    // if (currentIndex === prevIndex) return;

    // async function changeCardSection() {
    //   const { data } = await api.changeCardSection(BOARDID, cardId, prevIndex, currentIndex)
    //   setSections(data.sections)
    // }
    // changeCardSection()
  };


  function onClickAddSection(title: string) {
    //Add section to database -> get it
    async function createSection() {
      const { data } = await api.createSection(BOARDID, title);
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
    console.log('deleing', )
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
              <Box w='450px' key={section._id}>
              {/* <Box w='450px' h='fit-content' key={section._id}> */}
                <SectionComponent properties={section} positionIndex={index} handleDrop={handleDrop} onHoverSwapCard={onHoverSwapCard} onDropSwapCard={onDropSwapCard} onClickDeleteSection={onClickDeleteSection} onClickAddCard={onClickAddCard} onClickDeleteCard={onClickDeleteCard} />
              </Box>
            )
          })
        }

        <Input w='min(200px,20%)' type="text" bg='white' mt='5' mb='1' onChange={(e) => setNewSectionTitle(e.target.value)} />
        <Button onClick={() => onClickAddSection(newSectionTitle)}> Add Section</Button>

      </Flex>
    </Box>

  )
}
