import React from 'react';

const CalendarHeader = ({ headerRender }) => {
  

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 8px',
      marginBottom: '12px',
      alignItems: 'center'
    }}>
      {headerRender}
    </div> 
  );
};

export default CalendarHeader;
