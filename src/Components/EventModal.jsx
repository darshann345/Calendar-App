import React from 'react';
import { Modal, Form, Input, TimePicker } from 'antd';
import dayjs from 'dayjs';

const EventModal = ({ open, onCancel, onSubmit, editingEvent, form }) => {
  return (
    <Modal
      title={editingEvent ? 'Edit Event' : 'Add Event'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={editingEvent ? 'Update' : 'Add'}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Time" name="time">
          <TimePicker.RangePicker format="HH:mm" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EventModal;
