import React, { useEffect, useState } from 'react';
import { Alert, Row, Slide, Text } from 'native-base';
import { ColorType } from 'native-base/lib/typescript/components/types';

export type AlertType = 'error' | 'success' | 'info' | 'warning';

interface SlidingTopInfoProps {
  type: AlertType;
  text: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  millisToDisplay?: number;
  persistent?: boolean;
}

function typeToColours(type: AlertType): {
  textColor: ColorType;
} {
  switch (type) {
    case 'error':
      return { textColor: 'error.600' };
    case 'success':
      return { textColor: 'success.600' };
    case 'warning':
      return { textColor: 'warning.600' };
    case 'info':
      return { textColor: 'info.600' };
  }
}

export default function SlidingTopInfo({
  type,
  text,
  isOpen,
  setIsOpen,
  millisToDisplay = 1500,
  persistent = false,
}: SlidingTopInfoProps) {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isOpen && !persistent) {
      if (timer !== null) {
        clearTimeout(timer);
      }
      setTimer(
        setTimeout(() => {
          setIsOpen(false);
        }, millisToDisplay)
      );
      return () => {
        if (timer !== null) {
          clearTimeout(timer);
          setIsOpen(false);
        }
      };
    }
  }, [isOpen]);
  const { textColor } = typeToColours(type);
  return (
    <Slide in={isOpen} placement="top">
      <Alert justifyContent="center" status={type}>
        <Row alignItems="center">
          <Alert.Icon mr={2} />
          <Text color={textColor} fontWeight="medium">
            {text}
          </Text>
        </Row>
      </Alert>
    </Slide>
  );
}
