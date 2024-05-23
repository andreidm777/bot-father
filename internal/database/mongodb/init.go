package mongodb

import (
	"bot-father/internal/database/model"
	"context"

	"github.com/sirupsen/logrus"
	config "github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var collectionNames = []string{
	"bots",
	"products",
	"sessions",
	"steps",
	"users",
}

type mongoDb struct {
	client      *mongo.Client
	collections []*mongo.Collection
	ctx         context.Context
}

func init() {
	config.SetDefault("mongo_db.dsn", "mongodb://localhost:27017")
}

var _db *mongoDb

func Init(ctx context.Context) *mongoDb {

	cli, err := mongo.Connect(ctx, options.Client().ApplyURI(config.GetString("mongo_db.dsn")))
	if err != nil {
		panic(err)
	}

	db := cli.Database("settings")

	_db = &mongoDb{
		client:      cli,
		collections: make([]*mongo.Collection, 0, len(collectionNames)),
		ctx:         ctx,
	}

	for i, name := range collectionNames {
		_db.collections = append(_db.collections, db.Collection(name))
		if len(model.Indexes[i]) > 0 {
			names, err := _db.collections[i].Indexes().CreateMany(ctx, model.Indexes[i])
			if err != nil {
				panic(err)
			}
			logrus.Debugf("created indexes %v", names)
		}
	}

	return _db
}

func GetInstance() *mongoDb {
	return _db
}
