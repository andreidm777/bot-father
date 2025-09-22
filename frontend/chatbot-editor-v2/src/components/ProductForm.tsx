import { Form, Input, Button, Space } from "antd";
import { observer } from "mobx-react-lite";

interface ProductFormProps {
  initialValues?: {
    name: string;
  };
  onSubmit: (values: { name: string }) => void;
  onCancel: () => void;
}

export const ProductForm = observer(({ initialValues, onSubmit, onCancel }: ProductFormProps) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: { name: string }) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="Название продукта"
        rules={[{ required: true, message: "Пожалуйста, введите название продукта" }]}
      >
        <Input placeholder="Введите название продукта" />
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
});