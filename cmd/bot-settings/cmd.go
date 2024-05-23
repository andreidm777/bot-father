package main

import (
	"bot-father/internal/database/mongodb"
	"bot-father/internal/settings/application"
	"bot-father/pkg/runner"
	"flag"
	"sync"

	config "github.com/spf13/viper"
)

var (
	configFileName = flag.String("config", "/usr/local/etc/bot-settings.conf", "config file")
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

	mongodb.Init(ctx)

	var wg sync.WaitGroup

	handler := application.NewSettingsApp(ctx).Start(ctx, &wg)

	runner.ListenAndServe(ctx, config.GetString("listen"), handler)

	wg.Wait()
}
