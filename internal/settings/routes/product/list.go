package product

import (
	"bot-father/internal/cookie"
	"bot-father/internal/database/mongodb"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func List(c *gin.Context) {
	user, err := cookie.GetUserId(c)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "uknown user"})
		return
	}

	userId, err := primitive.ObjectIDFromHex(user)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "uknown user"})
		return
	}

	p, _ := mongodb.GetInstance().GetProducts(userId)

	c.JSON(http.StatusOK, gin.H{"status": "OK", "products": p})
}
