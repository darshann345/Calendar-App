import React, { useState, useEffect } from 'react';
import './App.css';
import { Calendar, theme, message, Form } from 'antd';
import dayjs from 'dayjs';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import CalendarHeader from './Components/CalendarHeader';
import EventModal from './Components/EventModal';
import EventList from './Components/EventList';

const App = () => {
  const { token } = theme.useToken();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState({});
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [form] = Form.useForm();
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    const storedDate = localStorage.getItem('selectedDate');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    if (storedDate) {
      setSelectedDate(dayjs(storedDate));
    }
    setEventsLoaded(true);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem('selectedDate', selectedDate.format('YYYY-MM-DD'));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (eventsLoaded) {
      localStorage.setItem('calendarEvents', JSON.stringify(events));
    }
  }, [events, eventsLoaded]);

  const onDateClick = (value) => {
    if (value.month() === currentDate.month()) {
      const dateKey = value.format('YYYY-MM-DD');
      const existingEvent = events[dateKey] || [];
      if (existingEvent.length > 0) {
        setIsModalOpen(false)
        setSelectedDate(value)
        return
      }
      setSelectedDate(value);
      form.resetFields();
      setEditingEventId(null);
      setIsModalOpen(true);
    }
  };
  const handleAddEventClick = (value) => {
    form.resetFields()
    setEditingEventId(null)
    setIsModalOpen(true)
  }

  // const handlePanelChange = (value) => setCurrentDate(value);

  const headerRender = ({ value, onChange }) => {
    const handlePrev = () => {
      const newValue = value.subtract(1, 'month');
      onChange(newValue);
      setCurrentDate(newValue);
    };

    const handleNext = () => {
      const newValue = value.add(1, 'month');
      onChange(newValue);
      setCurrentDate(newValue);
    };

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
        <Button icon={<LeftOutlined />} onClick={handlePrev} />
        <h3>{value.format('MMMM YYYY')}</h3>
        <Button icon={<RightOutlined />} onClick={handleNext} />
      </div>
    );
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingEventId(null);
  };

  const handleSubmit = (values) => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    const newEvent = {
      id: editingEventId || Date.now(),
      title: values.title,
      description: values.description || '',
      time: values.time
        ? values.time.map(t => t.format('HH:mm')).join(' - ')
        : 'All Day',
    };

    setEvents(prev => {
      const existing = prev[dateKey] || [];
      const updated = editingEventId
        ? existing.map(ev => ev.id === editingEventId ? newEvent : ev)
        : [...existing, newEvent];

      return { ...prev, [dateKey]: updated };
    });

    message.success(editingEventId ? 'Event updated' : 'Event added');
    setIsModalOpen(false);
    setEditingEventId(null);
    form.resetFields();
  };

  const handleEdit = (event) => {
    setEditingEventId(event.id);
    form.setFieldsValue({
      title: event.title,
      description: event.description,
      time: event.time === 'All Day' ? null : event.time.split(' - ').map(t => dayjs(t, 'HH:mm'))
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(ev => ev.id !== id)
    }));
    message.success('Event deleted');
  };

  const wrapperStyle = {
    position: "fixed",
    top: "10%",
    left: "20%",
    width: "50%",
    height: "auto",
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    padding: '16px',
    background: token.colorBgContainer
  };

  return (
    <>
      <div style={wrapperStyle}>
        <div style={{ height: '60vh', overflowY: 'auto' }}>
          <Calendar
            fullscreen={true}
            value={currentDate}
            onSelect={onDateClick}
            // onPanelChange={handlePanelChange}
            headerRender={headerRender}
          />
        </div>

        {selectedDate && events[selectedDate.format('YYYY-MM-DD')]?.length > 0 && (
          <EventList
            events={events[selectedDate.format('YYYY-MM-DD')] || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={() => {
              setEditingEventId(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
          />
        )}
      </div>


      <EventModal
        open={isModalOpen}
        onCancel={handleModalCancel}
        onSubmit={handleSubmit}
        editingEvent={editingEventId}
        form={form}
      />
    </>
  );
};

export default App;
