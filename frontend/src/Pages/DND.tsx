// import { Box, Flex, Input, Text } from "@chakra-ui/react";
// import nodeTest from "node:test";
// import React, { useState } from "react";
// import { useDrag, useDrop } from "react-dnd";
// import { ItemTypes, Node as NodeType } from '../types/Node';

// interface NodeProps {
//     property: NodeType;
// }

// export interface NodePassItem {
//     _id: string
//     x: number;
//     y: number;
//     isInside: boolean
//     index: number;
// }

// function Node({ property }: NodeProps) {
//     const [{ isDragging }, drag] = useDrag({
//         type: ItemTypes.NODE,
//         item: { x: property.x, y: property.y, _id: property.id, isInside: property.status === 'ON' },
//         collect: (monitor) => ({
//             isDragging: monitor.isDragging(),
//         }),
//     });

//     return (
//         <Box w='max-content' h='max-content' px='3' py='2' bg='blue' pos={property.status === 'ON' ? 'absolute' : 'static'} opacity={isDragging ? 0.5 : 1} ref={drag}
//             style={{ left: property.x, top: property.y }}
//         >
//             <Text color='white'>
//                 {property.text}
//             </Text>
//         </Box>
//     );
// };

// interface DropTargetProps {
//     nodes: NodeType[];
//     setNodes: React.Dispatch<React.SetStateAction<NodeType[]>>;
// }

// interface XYCoord {
//     x: number,
//     y: number
// }

// function DropTarget({ nodes, setNodes }: DropTargetProps) {
//     const dropRef = React.useRef<HTMLDivElement>(null);

//     const [{ isOver }, drop] = useDrop({
//         accept: ItemTypes.NODE,
//         drop: (item: NodePassItem, monitor) => {

//             const { x, y, _id, isInside } = item
//             let left, top = 0

//             if (isInside) {
//                 //Get difference from the last position

//                 const delta: XYCoord | null = monitor.getDifferenceFromInitialOffset();
//                 if (delta != null) {
//                     left = Math.round(x + delta.x);
//                     top = Math.round(y + delta.y);
//                 } else {
//                     return
//                 }
//             } else {
//                 //Get offset from the DOM?
//                 const clientOffset = monitor.getClientOffset();

//                 //Get bounding box of this drop zone?
//                 const dropTargetBoundingRect = dropRef.current?.getBoundingClientRect();

//                 // TODO: get center of the drag item - to make it center (width/2, height/2)
//                 if (clientOffset != null && dropTargetBoundingRect != null) {
//                     left = Math.round(clientOffset.x - dropTargetBoundingRect.left);
//                     top = Math.round(clientOffset.y - dropTargetBoundingRect.top);
//                 } else {
//                     return
//                 }
//             }

//             const index = nodes.findIndex((node) => node.id === _id);
//             const newNodes = [...nodes];
//             newNodes[index] = { ...newNodes[index], x: left, y: top, status: 'ON' };
//             setNodes(newNodes);
        
//         },
//         collect: (monitor) => ({
//             isOver: !!monitor.isOver(),
//         }),
//     });

//     drop(dropRef);

//     return (
//         <Box
//             w="full"
//             h="full"
//             bg="red.500"
//             opacity={isOver ? 0.5 : 1}
//             ref={dropRef}
//         ></Box>
//     );
// }

// interface NewTodo {
//     title: string;
// }


// function MindMap() {
//     const [nodes, setNodes] = useState<NodeType[]>([
//         { id: "0", text: "Cook", x: 0, y: 0, status: 'ON' },
//         { id: "1", text: "Sleep", x: -1, y: -1, status: 'OFF' },
//         { id: "2", text: "Play", x: 500, y: 500, status: 'ON' },
//     ]);

//     const [todo, setTodo] = useState<NewTodo>({ title: '' })

//     const addNode = () => {
//         const id = Date.now().toString();
//         const node: NodeType = { id, text: todo.title, x: -1, y: -1, status: 'OFF' };
//         setNodes([...nodes, node]);
//     };

//     const removeNode = (index: number) => {
//         const newNodes = [...nodes];
//         newNodes.splice(index, 1);
//         setNodes(newNodes);
//     };

//     return (
//         <Box >
//             <Flex my='3' mx='3' gap='3'>
//                 <Input w='min(50%,400px)'
//                     type="text"
//                     value={todo.title}
//                     onChange={(e) => setTodo({ title: e.target.value })}
//                 />

//                 <button onClick={addNode}>Add Node</button>

//                 {nodes.filter(node => node.status !== 'ON').map((node) => (<div key={node.id}>
//                     <Node key={node.id} property={node} />
//                 </div>
//                 ))}

//             </Flex>

//             <Box w='500px' h='500px' pos='relative'>
//                 <DropTarget nodes={nodes} setNodes={setNodes} />
//                 {nodes.filter(node => node.status === 'ON').map((node, index) => (
//                     <Node key={node.id} property={node} />
//                 ))}
//             </Box>
//         </Box>
//     )
// }

// export default function DND() {
//     return (
//         <MindMap />
//     )
// }
import React from 'react'

const DND = () => {
  return (
    <div>DND</div>
  )
}

export default DND