package application

import (
	"bot-father/pkg/app"
	"context"
	"net/http"
	"sync"
)

type authApplication struct {
}

var _app app.Application

func (da *authApplication) Start(ctx context.Context, wg *sync.WaitGroup) http.Handler {
	wg.Add(1)
	defer wg.Done()
	return da.Router()
}

func NewAuthApp(ctx context.Context) app.Application {
	_app = &authApplication{}
	return _app
}
