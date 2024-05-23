package routes

import (
	"bot-father/internal/cookie"
	"bot-father/internal/database"
	"bot-father/internal/database/model"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type LoginStruct struct {
	Email  string `json:"email" binding:"required,email"`
	Passwd string `json:"passwd" binding:"required,min=6"`
}

func Login(c *gin.Context) {
	var reg LoginStruct
	if err := c.ShouldBindJSON(&reg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := database.GetInstance()

	var err error
	var user model.User

	if user, err = db.GetUserByEmail(reg.Email); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	if err = user.CheckPasswd(reg.Passwd); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	session := &model.Session{
		UserID: user.ID,
		Ip:     c.ClientIP(),
		Utime:  time.Now().Unix(),
	}

	if err = db.InsertSession(session); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	cookie.MakeAuthCookie(c, session.ID.Hex()+":"+user.ID.Hex())

	c.JSON(http.StatusOK, gin.H{"status": "OK"})
}
