import { observer } from "mobx-react-lite";
import { Form, Input, Button, Card, Typography, message, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { authStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export const LoginPage = observer(() => {
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await authStore.login(values.email, values.password);
      message.success("Успешный вход");
      // Redirect to the main page after successful login
      navigate("/");
    } catch (error) {
      message.error("Ошибка входа: Неверный email или пароль");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Вход в систему
        </Title>
        
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Пожалуйста, введите email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" type="email" />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Пожалуйста, введите пароль" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>
          
          <Form.Item>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button type="primary" htmlType="submit" loading={authStore.isLoading} block>
                Войти
              </Button>
            </Space>
          </Form.Item>
        </Form>
        
        {authStore.error && (
          <div style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            {authStore.error}
          </div>
        )}
      </Card>
    </div>
  );
});