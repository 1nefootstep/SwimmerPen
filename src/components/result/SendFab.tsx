import React from 'react';
import { SpeedDial } from 'react-native-elements';
import { IconNode } from 'react-native-elements/dist/icons/Icon';

interface SendFabProps {
  items: Array<{
    label: string;
    icon: IconNode;
    action: (() => void) | (() => Promise<void>);
  }>;
}

export default function SendFab({ items }: SendFabProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <SpeedDial
      isOpen={open}
      buttonStyle={{ backgroundColor: '#22d3ee' }}
      icon={{
        name: 'send-o',
        type: 'font-awesome',
        color: '#fff',
        backgroundColor: '#22d3ee',
      }}
      openIcon={{ name: 'close', color: '#fff', backgroundColor: '#22d3ee' }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
    >
      {items.map(e => (
        <SpeedDial.Action
          buttonStyle={{ backgroundColor: '#fff' }}
          key={e.label}
          icon={e.icon}
          title={e.label}
          onPress={e.action}
        />
      ))}
    </SpeedDial>
  );
}
