import React, { useState } from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Box, Button } from 'native-base';
import { Menu, Provider } from 'react-native-paper';
import { useAppSelector } from '../../state/redux/hooks';
import { formatTimeFromPosition } from '../../state/Util';
import DeleteTimerAlert from './DeleteTimerAlert';
import Drag, { Response } from 'reanimated-drag-resize';
import SetTimeModal from './SetTimeModal';

export interface SingleTimerProps {
  bounds: { x1: number; y1: number; x2: number; y2: number };
  id: number;
  startPositionMillis: number;
}

export default function SingleTimer({
  bounds,
  id,
  startPositionMillis,
}: SingleTimerProps) {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [h, setH] = useState(36);
  const [w, setW] = useState(84);
  const [draggable, setDraggable] = useState(true);
  const [resizeable, setResizable] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isSetTimeOpen, setIsSetTimeOpen] = useState<boolean>(false);
  const positionMillis = useAppSelector(state => state.video.positionMillis);

  const openMenu = () => {
    setIsMenuOpen(true);
    setDraggable(false);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
    setDraggable(true);
  };
  const difference = positionMillis - startPositionMillis;
  const absoluteDifference = Math.abs(difference);
  const formatted = formatTimeFromPosition(absoluteDifference);
  const toDisplay = difference >= 0 ? '+' + formatted : '-' + formatted;
  const fontSize = Math.sqrt((w * h) / 28);

  const updatePositions = (e: Response) => {
    setX(e.x);
    setY(e.y);
    setW(e.width);
    setH(e.height);
  };

  const StyledMenuItem = ({
    onPress,
    title,
  }: {
    onPress?: () => void;
    title: string;
  }) => (
    <Menu.Item
      onPress={onPress}
      title={title}
      style={{ height: 32 }}
      titleStyle={{ fontSize: 14 }}
    />
  );

  return (
    <Box style={StyleSheet.absoluteFill}>
      <Provider>
        <Drag
          height={h}
          width={w}
          x={x}
          y={y}
          draggable={draggable}
          resizable={resizeable}
          resizerImageSource={resizeable ? undefined : null}
          limitationHeight={bounds.y2}
          limitationWidth={bounds.x2}
          onDragEnd={updatePositions}
          onResizeEnd={updatePositions}
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
            onLongPress={openMenu}
            _text={{ fontSize: fontSize }}
          >
            {toDisplay}
          </Button>
          <Menu
            visible={isMenuOpen}
            onDismiss={closeMenu}
            anchor={{ x: x + w * 0.75, y: y + h * 0.9 }}
            style={{ width: 90 }}
          >
            <StyledMenuItem
              onPress={() => {
                setIsSetTimeOpen(true);
                closeMenu();
              }}
              title="Set Time"
            />
            <StyledMenuItem
              onPress={() => {
                setIsAlertOpen(true);
                closeMenu();
              }}
              title="Delete"
            />
          </Menu>
        </Drag>
      </Provider>
      <DeleteTimerAlert
        id={id}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
      />
      <SetTimeModal
        isOpen={isSetTimeOpen}
        setIsOpen={setIsSetTimeOpen}
        id={id}
        positionMillis={positionMillis}
      />
    </Box>
  );
}
