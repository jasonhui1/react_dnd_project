import React, { useState, useEffect, useRef } from 'react';
import * as api from '../api';
import { OrderedList, ListItem, Flex, Checkbox, Button, Text, Box, Heading, Input } from '@chakra-ui/react';
import SectionComponent, { Section } from '../Components/Board/Section';


export interface statusInfo {
  sectionIndex: number
  cardIndex: number
}


export default function Board() {
  const [sections, setSections] = useState<Section[]>([{ _id: 'A', title: 'Element', cards: [] }, { _id: 'B', title: 'Anime', cards: [] }])
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [draggingInfo, setDraggingInfo] = useState<statusInfo | null>(null)
  const [hoveringInfo, setHoveringInfo] = useState<statusInfo | null>(null)
  const [direction, setDirection] = useState('')

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

  // const onHoverEmpty = (dragCardId: string, hoverIndex: number, dragSectionIndex: number, newSectionIndex: number) => {
  //   console.log('hoveringEmpty',)
  //   const down = prevHoveringInfo && hoveringInfo && prevHoveringInfo?.cardIndex < hoveringInfo?.cardIndex
  //   const add = down ? 1 : 0


  //   console.log('down', down)

  //   setPrevHoveringInfo(hoveringInfo ? { sectionIndex: hoveringInfo.sectionIndex, cardIndex: hoveringInfo.cardIndex + add } : null)

  // }


  const onHoverSwapCard = (dragCardId: string, hoverIndex: number, dragSectionIndex: number, newSectionIndex: number, dir:string) => {

    const prevSectionIndex = sections.findIndex(section => section.cards.some(card => card._id === dragCardId))

    //Swap between current section
    if (prevSectionIndex === newSectionIndex) {

      const newSection = sections[newSectionIndex]
      const dragIndex = newSection.cards.findIndex(card => card._id === dragCardId)

      // let updateCards = [...newSection.cards]

      setDraggingInfo({ sectionIndex: dragSectionIndex, cardIndex: dragIndex })
      setHoveringInfo({ sectionIndex: newSectionIndex, cardIndex: hoverIndex })
      setDirection(dir)

      // const updateCards = newSection.cards.filter((_, index) => index !== dragIndex);
      // updateCards.splice(hoverIndex, 0, card);

      // //Update section
      // let newSections = [...sections]
      // newSections[newSectionIndex] = { ...newSections[newSectionIndex], cards: updateCards }

      // setSections(newSections);

    } else {

      console.log('dragSectionIndex', dragSectionIndex)
      console.log('newSectionIndex', newSectionIndex)
      console.log('another section')
    }
  };

  // console.log('prevhoveringInfo', prevHoveringInfo)
  // console.log('hoveringInfo', hoveringInfo)
  // console.log('down', prevHoveringInfo && hoveringInfo && prevHoveringInfo?.cardIndex < hoveringInfo?.cardIndex)



  //Card, index to place in, section to place in
  const onDropSwapCard = async (dragCardId: string, hoverIndex: number, sectionIndex: number) => {
    setDraggingInfo(null)
    setHoveringInfo(null)
    setDirection('')

    const { data } = await api.changeCardPosition(BOARDID, dragCardId, hoverIndex, sectionIndex)
    setSections(data.sections)
  }

  //When drop to a new section
  const handleDrop = async (cardId: string, prevIndex: number, currentIndex: number) => {

    if (currentIndex === prevIndex) return;

    const { data } = await api.changeCardSection(BOARDID, cardId, prevIndex, currentIndex)
    setSections(data.sections)
  };


  function onClickAddSection(title: string) {
    //Add section to database -> get it
    async function createSection() {
      const { data } = await api.createSection(BOARDID, title);
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
                <SectionComponent properties={section} positionIndex={index} handleDrop={handleDrop} onHoverSwapCard={onHoverSwapCard} onDropSwapCard={onDropSwapCard} onClickDeleteSection={onClickDeleteSection} onClickAddCard={onClickAddCard} onClickDeleteCard={onClickDeleteCard} draggingInfo={draggingInfo} hoveringInfo={hoveringInfo} direction={direction}/>
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
