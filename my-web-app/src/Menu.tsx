import React from 'react';

interface MenuProps {
  onAddTopEvent: () => void;
  onAddGate: (gateType: 'AND' | 'OR' ) => void;
  onAddBasicEvent: () => void;
  onAddExternalEvent: () => void;
  onAddCondition: () => void;
  onAddConnection: () => void;
}

const Menu: React.FC<MenuProps> = ({ onAddTopEvent, onAddGate, onAddBasicEvent, onAddExternalEvent, onAddCondition, onAddConnection }) => {
  return (
    <div>
      <button onClick={onAddTopEvent}>Add Top Event</button>
      <button onClick={() => onAddGate('AND')}>Add AND Gate</button>
      <button onClick={() => onAddGate('OR')}>Add OR Gate</button>
      <button onClick={onAddBasicEvent}>Add Basic Event</button>
      <button onClick={onAddExternalEvent}>Add External Event</button>
      <button onClick={onAddCondition}>Add Condition</button>
      <button onClick={onAddConnection}>Add Connection</button>
    </div>
  );
};

export default Menu;
