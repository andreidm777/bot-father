import { Modal, Input, Select, Form } from 'antd';
import { observer } from 'mobx-react-lite';
import { store } from '../stores/store';

const { Option } = Select;
const { TextArea } = Input;

interface StepSettingsModalProps {
  nodeId: string;
  visible: boolean;
  onCancel: () => void;
  initialData: {
    label: string;
    type: string;
    payload?: string;
  };
}

export const StepSettingsModal = observer(({ 
  nodeId, 
  visible, 
  onCancel,
  initialData 
}: StepSettingsModalProps) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        store.updateNode(nodeId, values);
        onCancel();
      });
  };

  return (
    <Modal
      title="Настройки шага"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialData}
      >
        <Form.Item
          label="Название шага"
          name="label"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Тип шага"
          name="type"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="wait_message">Ждем сообщение</Option>
            <Option value="send_message">Отправить сообщение</Option>
            <Option value="reaction">Реакция</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Payload"
          name="payload"
        >
          <TextArea rows={3} placeholder="Дополнительные данные" />
        </Form.Item>
      </Form>
    </Modal>
  );
});