import { Form, Input, Button, Space } from "antd";
import { useForm } from "antd/es/form/Form";

interface BotFormProps {
  initialValues: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export const BotForm: React.FC<BotFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        name="type"
        label="Тип бота"
        rules={[{ required: true, message: "Пожалуйста, введите тип бота" }]}
      >
        <Input placeholder="Введите тип бота" />
      </Form.Item>

      <Form.Item
        name="botToken"
        label="Токен бота"
        rules={[{ required: true, message: "Пожалуйста, введите токен бота" }]}
      >
        <Input placeholder="Введите токен бота" />
      </Form.Item>

      <Form.Item
        name="botGroup"
        label="Группа бота"
        rules={[{ required: true, message: "Пожалуйста, введите группу бота" }]}
      >
        <Input placeholder="Введите группу бота" />
      </Form.Item>

      <Form.Item
        name="callbackUrl"
        label="Callback URL"
        rules={[{ required: true, message: "Пожалуйста, введите callback URL" }]}
      >
        <Input placeholder="Введите callback URL" />
      </Form.Item>

      <Form.Item
        name="webhookSecret"
        label="Webhook Secret (опционально)"
      >
        <Input placeholder="Введите webhook secret" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
          <Button onClick={onCancel}>
            Отмена
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};