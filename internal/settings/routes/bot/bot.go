package bot

import (
	"bot-father/internal/database/model"
	"bot-father/internal/database/mongodb"
	"net/http"

	gin "github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func List(c *gin.Context) {
	productParam := c.Param("product_id")

	productId, err := primitive.ObjectIDFromHex(productParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bots, err := mongodb.GetInstance().GetBots(productId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK", "bots": bots})
}

func Insert(c *gin.Context) {
	var bot model.Bot

	if err := c.ShouldBindJSON(&bot); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := mongodb.GetInstance().InsertBot(bot)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK", "bot": bot})
}

func Update(c *gin.Context) {
	botParam := c.Param("bot_id")

	botId, err := primitive.ObjectIDFromHex(botParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var bot model.Bot

	if err := c.ShouldBindJSON(&bot); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = mongodb.GetInstance().UpdateBot(botId, bot)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK", "bot": bot})
}

func Delete(c *gin.Context) {
	botParam := c.Param("bot_id")

	botId, err := primitive.ObjectIDFromHex(botParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = mongodb.GetInstance().DeleteBot(botId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK"})
}
