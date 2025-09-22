import { observer } from "mobx-react-lite";
import { Form, Input, Button, Card, Typography, message, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { authStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Title } = Typography;

export const LoginPage = observer(() => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

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

  const handleRegister = async (values: { email: string; password: string; confirmPassword: string }) => {
    try {
      await authStore.register(values.email, values.password, values.confirmPassword);
      message.success("Успешная регистрация");
      // Redirect to the main page after successful registration
      navigate("/");
    } catch (error) {
      message.error("Ошибка регистрации: Проверьте введенные данные");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          {isRegistering ? "Регистрация" : "Вход в систему"}
        </Title>
        
        {isRegistering ? (
          <Form onFinish={handleRegister} layout="vertical">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Пожалуйста, введите email" },
                { type: "email", message: "Пожалуйста, введите корректный email" }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Пожалуйста, введите пароль" },
                { min: 6, message: "Пароль должен содержать минимум 6 символов" }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: "Пожалуйста, подтвердите пароль" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
            </Form.Item>
            
            <Form.Item>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button type="primary" htmlType="submit" loading={authStore.isLoading} block>
                  Зарегистрироваться
                </Button>
                <Button onClick={() => setIsRegistering(false)} block>
                  Уже есть аккаунт? Войти
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <Form onFinish={handleLogin} layout="vertical">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Пожалуйста, введите email" },
                { type: "email", message: "Пожалуйста, введите корректный email" }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
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
                <Button onClick={() => setIsRegistering(true)} block>
                  Нет аккаунта? Зарегистрироваться
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
        
        {authStore.error && (
          <div style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            {authStore.error}
          </div>
        )}
      </Card>
    </div>
  );
});