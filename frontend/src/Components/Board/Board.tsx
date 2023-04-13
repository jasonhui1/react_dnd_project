import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { OrderedList, ListItem, Flex, Checkbox, Button, Text, Box, Heading, Input, Divider, Stack } from '@chakra-ui/react';
import SectionComponent, { Section } from '../Board/Section';
import { useParams } from 'react-router-dom';
import { BoardContextProvider } from '../../context/board';
import AddButton from '../AddButton';

export default function Board() {
  const [title, setTitle] = useState('')
  const [sections, setSections] = useState<Section[]>([{ _id: 'A', title: 'Element', cards: [] }, { _id: 'B', title: 'Anime', cards: [] }])
  const [newSectionTitle, setNewSectionTitle] = useState('')

  const { id = '64233d206555d18b2cbedd3d' } = useParams();
  //TODO
  //6. Reorder code

  useEffect(() => {
    async function fetchSections() {
      const { data } = await api.fetchBoardById(id);
      if (!data) {
        console.log('board fetch from id fail')
        return
      }

      setTitle(data.title)
      setSections(data.sections);
    }

    fetchSections()
  }, [id]);

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

    const { data } = await api.changeCardPosition(id, dragCardId, hoverIndex, sectionIndex)
    setSections(data.sections)
  }


  //When drop to a new section
  const handleDrop = async (cardId: string, prevIndex: number, currentIndex: number) => {

    if (currentIndex === prevIndex) return;

    const { data } = await api.changeCardSection(id, cardId, prevIndex, currentIndex)
    setSections(data.sections)
  };


  async function onClickAddSection(title: string) {
    //Add section to database -> get it
    const { data } = await api.createSection(id, title);
    setSections(data.sections);
  }

  async function onClickDeleteSection(sectionId: string) {
    const { data } = await api.deleteSection(id, sectionId);
    setSections(data.sections);
  }

  async function onClickAddCard(sectionId: string, title: string) {
    //Add section to database -> get it
    const { data } = await api.createCard(id, sectionId, title);
    setSections(data.sections);
  }

  async function onClickDeleteCard(sectionId: string, cardId: string) {
    const { data } = await api.deleteCard(id, sectionId, cardId);
    setSections(data.sections);
  }

  return (
    <BoardContextProvider
      handleDrop={handleDrop}
      onHoverSwapCard={onHoverSwapCard}
      onDropSwapCard={onDropSwapCard}
      onClickDeleteSection={onClickDeleteSection}
      onClickAddCard={onClickAddCard}
      onClickDeleteCard={onClickDeleteCard}
    >

      <Box>
        <Heading>{title}</Heading>
        <Divider my='5' />
        <Flex gap='3'>
          <SectionList sections={sections} />

          {/* ADD sections form */}
          <Box w='fit-content' bg='gray.300' p='5' my='5' mx='auto'>
            <Flex gap='2' mt='5' mb='1' align='center' justify={'center'}>
              <Input w='min(200px)' type="text" bg='white' onChange={(e) => setNewSectionTitle(e.target.value)} />
              <AddButton onClick={() => onClickAddSection(newSectionTitle)} />
            </Flex>
          </Box>

        </Flex>



      </Box >

    </BoardContextProvider>


  )
}

interface SectionListsProps {
  sections: Section[]
}

function SectionList({ sections }: SectionListsProps) {
  return (
    <>
      {
        sections.map((section, index) => {
          return (
            <Box w='450px' key={section._id} >
              <SectionComponent properties={section} positionIndex={index} />
            </Box>
          )
        })
      }
    </>
  )
}
