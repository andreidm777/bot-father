package template

import (
	"bot-father/internal/database/mongodb"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func List(c *gin.Context) {
	db := mongodb.GetInstance()

	productParam := c.Param("product_id")

	productId, err := primitive.ObjectIDFromHex(productParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	t, _ := db.GetTemplates(productId)

	c.JSON(http.StatusOK, gin.H{"status": "OK", "templates": t})
}
