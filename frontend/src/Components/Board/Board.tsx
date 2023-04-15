import React, { useState, useEffect } from 'react';
import * as api from '../../api';
import { OrderedList, ListItem, Flex, Checkbox, Button, Text, Box, Heading, Input, Divider, Stack } from '@chakra-ui/react';
import SectionComponent, { Section } from '../Board/Section';
import { useParams } from 'react-router-dom';
import { BoardContextProvider } from '../../context/board';
import AddForm from '../AddForm';


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
  const onHoverSwapCard = (cardId: string, newIndex: number, newSectionIndex: number) => {
    // Find previous indexes
    const prevSectionIndex = sections.findIndex(section => section.cards.some(card => card._id === cardId))
    const prevCardIndex = sections[prevSectionIndex].cards.findIndex(card => card._id === cardId)
    const updateSections = [...sections]

    const card = sections[prevSectionIndex].cards[prevCardIndex];
    // Update
    updateSections[prevSectionIndex].cards = updateSections[prevSectionIndex].cards.filter(card => card._id !== cardId);
    updateSections[newSectionIndex].cards.splice(newIndex, 0, card);

    //Update section
    setSections(updateSections);
  };


  //Card, index to place in, section to place in
  const onDropSwapCardPosition = async (cardId: string, newPositionIndex: number, currentSectionIndex: number) => {

    const { data } = await api.changeCardPosition(id, cardId, newPositionIndex, currentSectionIndex)
    setSections(data.sections)
  }


  //When drop to a new section
  const onDropSwapCardSection = async (cardId: string, prevSectionIndex: number, currentSectionIndex: number) => {

    if (currentSectionIndex === prevSectionIndex) return;

    const { data } = await api.changeCardSection(id, cardId, prevSectionIndex, currentSectionIndex)
    setSections(data.sections)
  };


  const onHoverSwapSection = (prevSectionIndex: number, newSectionIndex: number) => {
    // Find previous indexes
    const updatedSections = [...sections]
    // Update
    const section = sections[prevSectionIndex]
    updatedSections.splice(prevSectionIndex, 1);
    updatedSections.splice(newSectionIndex, 0, section);

    //Update section
    setSections(updatedSections);
  };

  const onDropSwapSectionPosition = async (sectionId: string, newIndex: number) => {
    const { data } = await api.changeSectionPosition(id, sectionId, newIndex)
    setSections(data.sections)
  }


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
      onHoverSwapCard={onHoverSwapCard}
      onDropSwapCardPosition={onDropSwapCardPosition}
      onDropSwapCardSection={onDropSwapCardSection}
      onClickDeleteSection={onClickDeleteSection}
      onClickAddCard={onClickAddCard}
      onClickDeleteCard={onClickDeleteCard}

      onHoverSwapSection={onHoverSwapSection}
      onDropSwapSectionPosition={onDropSwapSectionPosition}
    >

      <Box>
        <Heading>{title}</Heading>
        <Divider my='5' />
        <Flex gap='3'>
          <SectionList sections={sections} />

          {/* ADD sections form */}
          <Box w='fit-content' bg='gray.300' p='5' my='5' mx='auto'>
            <AddForm setState={setNewSectionTitle} onClick={() => onClickAddSection(newSectionTitle)} />
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
