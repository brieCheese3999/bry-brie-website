import React from 'react';

const MENU_ITEMS: { label: string; mnemonicIndex: number }[] = [
  { label: 'File', mnemonicIndex: 0 },
  { label: 'Edit', mnemonicIndex: 0 },
  { label: 'View', mnemonicIndex: 0 },
  { label: 'Options', mnemonicIndex: 0 },
  { label: 'Help', mnemonicIndex: 0 },
];

export const MenuBar: React.FC = () => {
  return (
    <div className="win95-menubar">
      {MENU_ITEMS.map((item) => (
        <span key={item.label}>
          <u>{item.label[item.mnemonicIndex]}</u>
          {item.label.slice(item.mnemonicIndex + 1)}
        </span>
      ))}
    </div>
  );
};
