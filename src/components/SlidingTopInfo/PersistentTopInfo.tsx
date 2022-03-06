import React, { ReactNode, useEffect, useState } from 'react';
import { Alert, Button, Row, Slide, Text } from 'native-base';
import { ColorType } from 'native-base/lib/typescript/components/types';
import Hidden from '../Hidden';

export type AlertType = 'error' | 'success' | 'info' | 'warning';

interface PersistentTopInfoProps {
  typeBefore: AlertType;
  typeAfter?: AlertType;
  textBefore: string;
  textAfter?: string;
  millisToChange?: number;
  placementBefore?: 'top' | 'right' | 'bottom' | 'left';
  placementAfter?: 'top' | 'right' | 'bottom' | 'left';
  componentToShowAfter?: ReactNode;
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

export default function PersistentTopInfo({
  typeBefore,
  typeAfter = typeBefore,
  textBefore,
  textAfter = textBefore,
  millisToChange = 1500,
  placementBefore = 'top',
  placementAfter = placementBefore,
  componentToShowAfter = null,
}: PersistentTopInfoProps) {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [changed, setChanged] = useState(false);
  useEffect(() => {
    if (!changed) {
      if (timer !== null) {
        clearTimeout(timer);
      }
      setTimer(
        setTimeout(() => {
          setChanged(true);
        }, millisToChange)
      );
    }
    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [changed]);
  const { textColor } = typeToColours(changed ? typeAfter : typeBefore);
  const showComponentAfter = changed && componentToShowAfter !== undefined;
  return (
    <Slide
      in={true}
      mt={changed ? 16 : 0}
      w={changed ? 60 : undefined}
      placement={changed ? placementAfter : placementBefore}
    >
      <Alert justifyContent="center" status={changed ? typeAfter : typeBefore}>
        <Hidden isHidden={showComponentAfter}>
          <Row alignItems="center">
            <Alert.Icon mr={2} />
            <Text color={textColor} fontWeight="medium">
              {changed ? textAfter : textBefore}
            </Text>
          </Row>
        </Hidden>
        <Hidden isHidden={!showComponentAfter}>
          <Button
            onPress={() => setChanged(false)}
            variant="unstyled"
            p={0}
            m={0}
          >
            {componentToShowAfter}
          </Button>
        </Hidden>
      </Alert>
    </Slide>
  );
}
