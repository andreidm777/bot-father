package bot

import (
	"bot-father/internal/database/mongodb"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func List(c *gin.Context) {

	productParam := c.Param("product_id")

	productId, err := primitive.ObjectIDFromHex(productParam)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "uknown product"})
		return
	}

	p, _ := mongodb.GetInstance().GetBots(productId)

	c.JSON(http.StatusOK, gin.H{"status": "OK", "bots": p})
}
