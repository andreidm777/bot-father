package application

import (
	"bot-father/pkg/app"
	"context"
	"net/http"
	"sync"
)

type settingsApplication struct {
}

var _app app.Application

func (da *settingsApplication) Start(ctx context.Context, wg *sync.WaitGroup) http.Handler {
	wg.Add(1)
	defer wg.Done()
	return da.Router()
}

func NewSettingsApp(ctx context.Context) app.Application {
	_app = &settingsApplication{}
	return _app
}
