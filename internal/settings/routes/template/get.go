package template

import (
	"bot-father/internal/database/mongodb"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func Get(c *gin.Context) {
	db := mongodb.GetInstance()

	templateParam := c.Param("template_id")

	templateId, err := primitive.ObjectIDFromHex(templateParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	t, _ := db.GetTemplate(templateId)

	s, _ := db.GetSteps(templateId)

	c.JSON(http.StatusOK, gin.H{
		"status":   "OK",
		"template": t,
		"steps":    s,
	})
}
