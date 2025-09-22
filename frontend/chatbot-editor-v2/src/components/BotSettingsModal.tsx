import { Modal, Form, Input, Button, Select, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { store } from '../stores/store';
import { useState, useRef, useEffect } from "react";

const { Option } = Select;

export const BotSettingsModal = observer(() => {
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await store.saveBotSettings(values);
      message.success('Настройки бота сохранены');
      store.closeSettingsModal();
    } catch (error) {
      message.error('Ошибка при сохранении настроек');
    }
  };

  return (
    <Modal
      title="Настройки бота"
      visible={store.isSettingsModalOpen}
      onOk={handleSave}
      onCancel={() => store.closeSettingsModal()}
      confirmLoading={store.isLoading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...store.currentBot,
          type: store.currentBot?.type || 'telegram'
        }}
      >
        <Form.Item name="type" label="Тип бота" rules={[{ required: true }]}>
          <Select>
            <Option value="telegram">Telegram</Option>
            <Option value="vk">VK</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="botToken"
          label="Токен бота"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="botGroup"
          label="Группа бота"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="callbackUrl"
          label="Callback URL"
          rules={[{ type: 'url', required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="webhookSecret"
          label="Секрет вебхука"
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
});