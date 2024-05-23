package model

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	BOT          = 0
	PRODUCT      = 1
	SESSION      = 2
	STEP         = 3
	TEMPLATE     = 4
	USER         = 5
	PRODUCT_USER = 6
	MAX          = 7
)

var Indexes [][]mongo.IndexModel

func init() {
	Indexes = make([][]mongo.IndexModel, MAX)

	Indexes[USER] = append(Indexes[USER],
		mongo.IndexModel{
			Keys:    bson.D{{Key: "email", Value: "text"}},
			Options: options.Index().SetUnique(true),
		},
	)

	Indexes[PRODUCT] = append(Indexes[PRODUCT],
		mongo.IndexModel{
			Keys:    bson.D{{Key: "name", Value: "text"}},
			Options: options.Index().SetUnique(true),
		},
	)

	Indexes[SESSION] = append(Indexes[SESSION],
		mongo.IndexModel{
			Keys: bson.D{{"user_id", 1}},
		},
	)

	Indexes[BOT] = append(Indexes[BOT],
		mongo.IndexModel{
			Keys: bson.D{{"product_id", 1}},
		},
	)

	Indexes[TEMPLATE] = append(Indexes[TEMPLATE],
		mongo.IndexModel{
			Keys: bson.D{{"product_id", 1}},
		},
	)

	Indexes[STEP] = append(Indexes[TEMPLATE],
		mongo.IndexModel{
			Keys: bson.D{{"template_id", 1}},
		},
	)

	Indexes[PRODUCT_USER] = append(Indexes[PRODUCT_USER],
		mongo.IndexModel{
			Keys: bson.D{{"product_id", 1}},
		},
		mongo.IndexModel{
			Keys: bson.D{{"user_id", 1}},
		},
	)
}
