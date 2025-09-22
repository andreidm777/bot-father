import { observer } from "mobx-react-lite";
import { useParams, useNavigate } from "react-router-dom";
import { Button, List, Card, Typography, Modal, message, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { botStore } from "../stores/botStore";
import { productStore } from "../stores/productStore";
import { BotForm } from "../components/BotForm";
import { reaction } from "mobx";

const { Title } = Typography;

export const BotList = observer(() => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBot, setEditingBot] = useState<any>(null);

  useEffect(() => {
    if (productId) {
      // Load bots for this product
      botStore.loadBots(productId);
      
      // Also ensure we have the product details
      const product = productStore.getProductById(productId);
      if (product) {
        productStore.setCurrentProduct(product);
      }
    }
  }, [productId]);

  useEffect(() => {
    // If authentication is needed, redirect to login page
    const disposer = reaction(
      () => botStore.needsAuthentication,
      (needsAuth) => {
        if (needsAuth) {
          navigate('/login');
        }
      }
    );
    
    return disposer;
  }, [navigate]);

  const handleAddBot = () => {
    setEditingBot(null);
    setIsModalVisible(true);
  };

  const handleEditBot = (bot: any) => {
    setEditingBot(bot);
    setIsModalVisible(true);
  };

  const handleDeleteBot = (bot: any) => {
    if (!productId) return;
    
    Modal.confirm({
      title: "Удалить бота?",
      content: `Вы уверены, что хотите удалить бота "${bot.type}"?`,
      okText: "Да",
      okType: "danger",
      cancelText: "Нет",
      onOk: async () => {
        try {
          await botStore.deleteBot(productId, bot.id);
          if (botStore.needsAuthentication) {
            navigate('/login');
            return;
          }
          message.success("Бот успешно удален");
        } catch (error) {
          if (!botStore.needsAuthentication) {
            message.error("Ошибка при удалении бота");
          }
        }
      }
    });
  };

  const handleModalOk = async (values: any) => {
    if (!productId) return;
    
    try {
      if (editingBot) {
        await botStore.updateBot(productId, editingBot.id, values);
        if (botStore.needsAuthentication) {
          navigate('/login');
          return;
        }
        message.success("Бот успешно обновлен");
      } else {
        await botStore.createBot(productId, values);
        if (botStore.needsAuthentication) {
          navigate('/login');
          return;
        }
        message.success("Бот успешно создан");
      }
      setIsModalVisible(false);
    } catch (error) {
      if (!botStore.needsAuthentication) {
        message.error("Ошибка при сохранении бота");
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleBack = () => {
    navigate("/");
  };

  // If authentication is needed, don't render the bot list
  if (botStore.needsAuthentication) {
    return null;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
          >
            Назад к продуктам
          </Button>
          <Title level={2}>
            Боты для {productStore.currentProduct?.name || "продукта"}
          </Title>
        </Space>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddBot}
        >
          Добавить бота
        </Button>
      </div>

      {botStore.isLoading ? (
        <p>Загрузка...</p>
      ) : botStore.error ? (
        <p style={{ color: "red" }}>{botStore.error}</p>
      ) : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={botStore.bots}
          renderItem={(bot) => (
            <List.Item>
              <Card
                title={bot.type}
                actions={[
                  <EditOutlined key="edit" onClick={() => handleEditBot(bot)} />,
                  <DeleteOutlined key="delete" onClick={() => handleDeleteBot(bot)} />
                ]}
                hoverable
                onClick={() => navigate(`/product/${productId}/bot/${bot.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <p><strong>Токен:</strong> {bot.botToken}</p>
                <p><strong>Группа:</strong> {bot.botGroup}</p>
                <p><strong>Callback URL:</strong> {bot.callbackUrl}</p>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={editingBot ? "Редактировать бота" : "Создать бота"}
        open={isModalVisible}
        footer={null}
        onCancel={handleModalCancel}
      >
        <BotForm
          initialValues={editingBot || { 
            type: "", 
            botToken: "", 
            botGroup: "", 
            callbackUrl: "",
            webhookSecret: ""
          }}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
});