import React from 'react';
import { Text, Alert, Column, Row, IconButton, CloseIcon } from 'native-base';

export default function AlertMessage(props: { msg: string }) {
  return (
    <Alert w="100%" status="error">
      <Column space={2} flexShrink={1} w="100%">
        <Row flexShrink={1} space={2} justifyContent="space-between">
          <Row space={2} flexShrink={1}>
            <Alert.Icon mt="1" />
            <Text fontSize="md" color="coolGray.800">
              {props.msg}
            </Text>
          </Row>
          <IconButton
            variant="unstyled"
            icon={<CloseIcon size="3" color="coolGray.600" />}
          />
        </Row>
      </Column>
    </Alert>
  );
}
