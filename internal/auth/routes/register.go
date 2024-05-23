package routes

import (
	"bot-father/internal/database"
	"bot-father/internal/database/model"
	"net/http"
	"time"

	"bot-father/pkg/util"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type Registration struct {
	Email   string `json:"email" binding:"required,email"`
	Passwd1 string `json:"passwd1" binding:"required,min=6"`
	Passwd2 string `json:"passwd2" binding:"required,eqfield=Passwd1"`
}

func Register(c *gin.Context) {
	var reg Registration
	if err := c.ShouldBindJSON(&reg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := database.GetInstance()

	if _, err := db.GetUserByEmail(reg.Email); err == nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	salt := util.RandStringBytes(8)

	if err := db.InsertUser(&model.User{
		Email:    reg.Email,
		Passwd:   util.GetMd5(reg.Passwd1 + salt),
		Flags:    0,
		CTime:    time.Now().Unix(),
		Salt:     salt,
		IsActive: true,
	}); err != nil {
		logrus.Errorf("cannot insert records %s", err.Error())
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK"})
}
