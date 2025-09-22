package application

import (
	"bot-father/internal/auth/routes"
	"bot-father/pkg/router"

	"github.com/gin-gonic/gin"
)

func (da *authApplication) Router() *gin.Engine {

	r := router.GetGinRouter(&router.RouterConfig{
		CORS: true,
	})

	r.PUT("/register", routes.Register)
	r.POST("/login", routes.Login)
	r.POST("/auth", routes.Login)

	return r
}
