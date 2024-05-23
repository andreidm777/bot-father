package product

import (
	"bot-father/internal/database/model"
	"bot-father/internal/database/mongodb"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Insert(c *gin.Context) {
	db := mongodb.GetInstance()

	var product model.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := db.InsertProduct(&product)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK", "product": product})
}
