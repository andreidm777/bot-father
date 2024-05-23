package step

import (
	"bot-father/internal/database/model"
	"bot-father/internal/database/mongodb"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func Update(c *gin.Context) {
	db := mongodb.GetInstance()

	tmplParam := c.Param("template_id")

	templateId, err := primitive.ObjectIDFromHex(tmplParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var steps []model.Step

	if err := c.ShouldBindJSON(&steps); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, v := range steps {
		v.TemplateID = templateId
	}

	err = db.CheckAndUpdateSteps(steps)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK", "steps": steps})
}
