import { Modal, Form, Input, Button, notification } from 'antd';
import { observer } from 'mobx-react-lite';
import { store } from '../stores/store';
import { useState, useRef, useEffect } from "react";

export const BotSettingsModal = observer(() => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      await store.saveBotSettings(values); // Теперь вызываем метод store
      store.closeSettingsModal();
      notification.success({
        message: 'Настройки сохранены',
        description: 'Новые настройки бота успешно применены'
      });
    } catch (error: unknown) {
      console.error('Ошибка сохранения настроек:', error);
      notification.error({
        message: 'Ошибка сохранения',
        description: error instanceof Error
        ? error.message 
        : 'Проверьте правильность заполнения полей'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (store.isSettingsModalOpen) {
      form.setFieldsValue(store.botSettings);
    }
  }, [store.isSettingsModalOpen, form]);

  return (
    <Modal
      title="Настройки бота"
      open={store.isSettingsModalOpen}
      onCancel={() => store.closeSettingsModal()}
      footer={[
        <Button key="back" onClick={() => store.closeSettingsModal()}>
          Отмена
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSave}
          loading={isSubmitting}
        >
          Сохранить
        </Button>,
      ]}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={store.botSettings}
      >
        <Form.Item
          label="Токен бота"
          name="botToken"
          rules={[
            { required: true, message: 'Пожалуйста, введите токен бота' },
            { min: 10, message: 'Токен слишком короткий' }
          ]}
        >
          <Input.Password placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" />
        </Form.Item>

        <Form.Item
          label="Группа бота"
          name="botGroup"
          rules={[
            { required: true, message: 'Пожалуйста, введите группу бота' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: 'Только латинские буквы, цифры и подчеркивания' }
          ]}
        >
          <Input placeholder="my_super_bot" />
        </Form.Item>

        <Form.Item
          label="Callback URL для событий"
          name="callbackUrl"
          rules={[
            { required: true, message: 'Пожалуйста, введите URL' },
            { type: 'url', message: 'Введите корректный URL' }
          ]}
        >
          <Input placeholder="https://example.com/api/callback" />
        </Form.Item>

        <Form.Item
          label="Секрет для вебхука (опционально)"
          name="webhookSecret"
        >
          <Input.Password placeholder="Необязательное поле" />
        </Form.Item>
      </Form>
    </Modal>
  );
});