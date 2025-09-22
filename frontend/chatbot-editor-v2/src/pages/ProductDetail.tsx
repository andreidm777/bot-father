import { observer } from "mobx-react-lite";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Card, Space } from "antd";
import { ArrowLeftOutlined, SettingOutlined } from "@ant-design/icons";
import { productStore } from "../stores/productStore";
import { useEffect, useState } from "react";
import BotBuilder from "../components/BotBuilder";

const { Title } = Typography;

export const ProductDetail = observer(() => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [showBotBuilder, setShowBotBuilder] = useState(false);

  useEffect(() => {
    if (productId) {
      const product = productStore.getProductById(productId);
      if (product) {
        productStore.setCurrentProduct(product);
      }
    }
  }, [productId]);

  const handleBack = () => {
    navigate("/");
  };

  const handleManageBots = () => {
    setShowBotBuilder(true);
  };

  if (showBotBuilder) {
    return <BotBuilder />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ marginBottom: "20px" }}
          >
            Назад к списку продуктов
          </Button>
        </div>

        <Card>
          <Title level={2}>
            {productStore.currentProduct ? productStore.currentProduct.name : "Продукт не найден"}
          </Title>
          
          {productStore.currentProduct ? (
            <div>
              <p><strong>ID:</strong> {productStore.currentProduct.id}</p>
              <p><strong>Название:</strong> {productStore.currentProduct.name}</p>
              
              <Button 
                type="primary" 
                icon={<SettingOutlined />}
                onClick={handleManageBots}
                style={{ marginTop: "20px" }}
              >
                Управление ботами
              </Button>
            </div>
          ) : (
            <p>Продукт с ID {productId} не найден.</p>
          )}
        </Card>
      </Space>
    </div>
  );
});