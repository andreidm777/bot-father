package routes

import (
	"bot-father/internal/cookie"
	"bot-father/internal/database"
	"bot-father/internal/database/model"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

const LIVE_SESSION_TIME = 24 * 60 * 60

func Auth(c *gin.Context) {
	db := database.GetInstance()

	cookId, err := c.Cookie(cookie.SID_COOKIE)

	cids := strings.Split(cookId, ":")

	if err != nil {
		logrus.Errorf("cannot get cookie %s", err.Error())
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	if len(cids) != 2 {
		logrus.Errorf("bad cookie %s", cookId)
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	var session model.Session

	if session, err = db.GetSession(cids[0]); err != nil {
		logrus.Errorf("cannot get session %s", err.Error())
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	if session.UserID.Hex() != cids[1] {
		logrus.Errorf("cookie is not format %s", cookId)
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	if session.UserID.Hex() != cids[1] {
		logrus.Errorf("cookie is not format %s", cookId)
		cookie.ResetCookie(c)
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	if time.Now().Unix()-session.Utime > LIVE_SESSION_TIME {
		logrus.Error("session expired")
		cookie.ResetCookie(c)
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}
	session.Utime = time.Now().Unix()

	db.UpdateSession(session)

}
