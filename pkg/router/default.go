package router

import (
	"fmt"
	"io"
	"os"

	"bot-father/pkg/graphite"

	"github.com/gin-gonic/gin"
)

type RouterConfig struct {
	Graphite bool
	Ping     bool
}

func GetGinRouter(cfg *RouterConfig) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)

	gin.DefaultWriter = io.MultiWriter(os.Stdout)

	r := gin.New()
	r.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {

		return fmt.Sprintf("%s - \"%s %s %d %s \"%s\" %s\"\n",
			param.ClientIP,
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	}))
	r.Use(gin.Recovery())

	if cfg.Graphite {
		r.Use(graphite.GinStatMiddleware)
	}

	if cfg.Ping {
		r.GET("/ping/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "ok",
			})
		})
	}

	return r
}
