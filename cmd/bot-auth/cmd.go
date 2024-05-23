package main

import (
	"bot-father/internal/auth/application"
	"bot-father/internal/database/mongodb"
	"bot-father/pkg/runner"
	"flag"
	"sync"

	config "github.com/spf13/viper"
)

var (
	configFileName = flag.String("config", "/usr/local/etc/bot-auth.conf", "config file")
)

func init() {
	config.SetDefault("liveness_enabled", false)
}

func main() {
	flag.Parse()
	ctx := runner.NewDefaultRunner(
		*configFileName,
		map[string]func(param string){},
	).StartAsync()

	var wg sync.WaitGroup

	mongodb.Init(ctx)

	handler := application.NewAuthApp(ctx).Start(ctx, &wg)

	runner.ListenAndServe(ctx, config.GetString("listen"), handler)

	wg.Wait()
}
