import { observer } from "mobx-react-lite";
import { Button, List, Card, Typography, Modal, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { productStore } from "../stores/productStore";
import { ProductForm } from "../components/ProductForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reaction } from "mobx";

const { Title } = Typography;

export const ProductsList = observer(() => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    productStore.loadProducts();
  }, []);

  useEffect(() => {
    // If authentication is needed, redirect to login page
    const disposer = reaction(
      () => productStore.needsAuthentication,
      (needsAuth) => {
        if (needsAuth) {
          navigate('/login');
        }
      }
    );
    
    return disposer;
  }, [navigate]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalVisible(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = (product: any) => {
    Modal.confirm({
      title: "Удалить продукт?",
      content: `Вы уверены, что хотите удалить продукт "${product.name}"?`,
      okText: "Да",
      okType: "danger",
      cancelText: "Нет",
      onOk: async () => {
        try {
          await productStore.deleteProduct(product.id);
          if (productStore.needsAuthentication) {
            navigate('/login');
            return;
          }
          message.success("Продукт успешно удален");
        } catch (error) {
          if (!productStore.needsAuthentication) {
            message.error("Ошибка при удалении продукта");
          }
        }
      }
    });
  };

  const handleModalOk = async (values: any) => {
    try {
      if (editingProduct) {
        await productStore.updateProduct(editingProduct.id, values);
        if (productStore.needsAuthentication) {
          navigate('/login');
          return;
        }
        message.success("Продукт успешно обновлен");
      } else {
        await productStore.createProduct(values);
        if (productStore.needsAuthentication) {
          navigate('/login');
          return;
        }
        message.success("Продукт успешно создан");
      }
      setIsModalVisible(false);
    } catch (error) {
      if (!productStore.needsAuthentication) {
        message.error("Ошибка при сохранении продукта");
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // If authentication is needed, don't render the product list
  if (productStore.needsAuthentication) {
    return null;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Title level={2}>Продукты</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddProduct}
        >
          Добавить продукт
        </Button>
      </div>

      {productStore.isLoading ? (
        <p>Загрузка...</p>
      ) : productStore.error ? (
        <p style={{ color: "red" }}>{productStore.error}</p>
      ) : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={productStore.products}
          renderItem={(product) => (
            <List.Item>
              <Card
                title={product.name}
                actions={[
                  <EditOutlined key="edit" onClick={() => handleEditProduct(product)} />,
                  <DeleteOutlined key="delete" onClick={() => handleDeleteProduct(product)} />
                ]}
              >
                <p>ID: {product.id}</p>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={editingProduct ? "Редактировать продукт" : "Создать продукт"}
        visible={isModalVisible}
        footer={null}
        onCancel={handleModalCancel}
      >
        <ProductForm
          initialValues={editingProduct || { name: "" }}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
});