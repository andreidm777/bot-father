package app

import (
	"context"
	"net/http"
	"sync"
)

type Application interface {
	Start(ctx context.Context, wg *sync.WaitGroup) http.Handler
}
