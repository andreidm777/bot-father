package cookie

import (
	"errors"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

const (
	SID_COOKIE      = "bot_fsid"
	LOGIN_COOKIE    = "bot_login"
	SESSION_EXPIRES = 86400
)

var ErrorCookieNotValid = errors.New("cookie not valid")

func ResetCookie(c *gin.Context) {
	c.SetCookie(SID_COOKIE,
		"",
		0,
		"",
		"",
		true,
		true)

	c.SetCookie(LOGIN_COOKIE,
		"0",
		0,
		"",
		"",
		true,
		false)
}

func MakeAuthCookie(c *gin.Context, sessionHash string) {
	c.SetCookie(SID_COOKIE,
		sessionHash,
		SESSION_EXPIRES,
		"",
		"",
		true,
		true)

	c.SetCookie(LOGIN_COOKIE,
		"1",
		SESSION_EXPIRES,
		"",
		"",
		true,
		false)
}

func GetUserId(c *gin.Context) (string, error) {
	cookId, err := c.Cookie(SID_COOKIE)

	cids := strings.Split(cookId, ":")

	if err != nil {
		logrus.Errorf("cannot get cookie %s", err.Error())
		return "", err
	}

	if len(cids) < 2 {
		return "", ErrorCookieNotValid
	}

	return cids[1], nil
}
