import React, { useState } from 'react';
import { List, Button, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const EventList = ({ events = [], onEdit, onDelete,onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const safeEvents = Array.isArray(events) ? events : [];

  const filteredEvents = safeEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Events</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Input
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '200px' }}
        />
        <SearchOutlined style={{ fontSize: 18 }} />
      </div>

      <List
        itemLayout="horizontal"
        dataSource={filteredEvents}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button icon={<EditOutlined />} onClick={() => onEdit(item)} />,
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => onDelete(item.id)}
              />,
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={`${item.description} ${item.time ? `(${item.time})` : ''}`}
            />
          </List.Item>
        )}
      />
      <Button onClick = {onAdd}>
        Add Events
      </Button>
    </div>
  );
};

export default EventList;
