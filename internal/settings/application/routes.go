package application

import (
	"bot-father/internal/settings/routes/bot"
	"bot-father/internal/settings/routes/product"
	"bot-father/internal/settings/routes/template"
	"bot-father/pkg/router"

	"bot-father/internal/settings/routes/step"

	"github.com/gin-gonic/gin"
)

func (da *settingsApplication) Router() *gin.Engine {

	r := router.GetGinRouter(&router.RouterConfig{})
	r.GET("/product/:product_id/bots", bot.List)
	r.PUT("/product/:product_id/bot", bot.Insert)
	r.POST("/product/:product_id/bot/:bot_id", bot.Update)
	r.DELETE("/product/:product_id/bot/:bot_id", bot.Delete)

	r.GET("/product/:product_id/template/:template_id", template.Get)
	r.PUT("/product/:product_id/template", template.Insert)
	r.POST("/product/:product_id/template/:template_id", template.Update)
	r.DELETE("/product/:product_id/template/:template_id", template.Delete)

	r.PUT("/product/:product_id/template/:template_id/step", step.Insert)
	r.POST("/product/:product_id/template/:template_id/step/:step_id", step.Update)
	r.DELETE("/product/:product_id/template/:template_id/step/:step_id", step.Delete)

	r.GET("/product/:product_id/templates", template.List)

	r.GET("/product/:product_id", product.Get)
	r.PUT("/product", product.Insert)
	r.POST("/product/:product_id", product.Update)
	r.GET("/products", product.List)
	return r
}
