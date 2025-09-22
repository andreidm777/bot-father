package product

import (
	"bot-father/internal/cookie"
	"bot-father/internal/database/model"
	"bot-father/internal/database/mongodb"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func Insert(c *gin.Context) {
	db := mongodb.GetInstance()

	var product model.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := cookie.GetUserId(c)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "uknown user"})
		return
	}

	userId, _ := primitive.ObjectIDFromHex(user)

	product.UserID = userId
	err = db.InsertProduct(&product)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK", "product": product})
}
