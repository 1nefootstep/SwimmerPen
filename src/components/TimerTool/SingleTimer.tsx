import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Box, Button } from 'native-base';
import { useAppSelector } from '../../state/redux/hooks';
import { formatTimeFromPosition } from '../../state/Util';
import DeleteTimerAlert from './DeleteTimerAlert';
import Drag from 'reanimated-drag-resize';

export interface SingleTimer2Props {
  bounds: { x1: number; y1: number; x2: number; y2: number };
  id: number;
  startPositionMillis: number;
}

export default function SingleTimer2({
  bounds,
  id,
  startPositionMillis,
}: SingleTimer2Props) {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [h, setH] = useState(36);
  const [w, setW] = useState(84);
  const [resizeable, setResizable] = useState(false);

  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const positionMillis = useAppSelector(state => state.video.positionMillis);

  const difference = positionMillis - startPositionMillis;
  const absoluteDifference = Math.abs(difference);
  const formatted = formatTimeFromPosition(absoluteDifference);
  const toDisplay = difference >= 0 ? '+' + formatted : '-' + formatted;
  const fontSize = Math.sqrt((w * h) / 28);

  return (
    <Box style={StyleSheet.absoluteFill}>
      <Drag
        height={h}
        width={w}
        x={x}
        y={y}
        resizable={resizeable}
        resizerImageSource={resizeable ? undefined : null}
        limitationHeight={bounds.y2}
        limitationWidth={bounds.x2}
        onDragEnd={e => {
          setX(e.x);
          setY(e.y);
          setW(e.width);
          setH(e.height);
        }}
        onResizeEnd={e => {
          setX(e.x);
          setY(e.y);
          setW(e.width);
          setH(e.height);
        }}
      >
        <Button
          style={{
            backgroundColor: '#facc15',
            borderColor: '#CA8A04',
            borderWidth: 1,
            borderRadius: 4,
            flex: 1,
          }}
          opacity={0.8}
          onPress={() => setResizable(!resizeable)}
          onLongPress={() => setIsAlertOpen(true)}
          _text={{ fontSize: fontSize }}
        >
          {toDisplay}
        </Button>
      </Drag>
      <DeleteTimerAlert
        id={id}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
      />
    </Box>
  );
}
