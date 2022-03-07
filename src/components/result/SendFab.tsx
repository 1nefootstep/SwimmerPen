import React from 'react';
import { FAB, Portal, Provider } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

interface SendFabProps {
  items: Array<{
    label: string;
    icon: IconSource;
    onPress: (() => void) | (() => Promise<void>);
  }>;
}

export default function SendFab({ items }: SendFabProps) {
  const [open, setOpen] = React.useState(false);
  const onStateChange = ({ open }: { open: boolean }) => setOpen(open);
  return (
    <Provider>
      <Portal>
        <FAB.Group
          visible={true}
          open={open}
          icon={open ? 'close' : 'send'}
          actions={items}
          onStateChange={onStateChange}
        />
      </Portal>
    </Provider>
  );
}
