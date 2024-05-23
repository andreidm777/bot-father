package mongodb

import (
	"bot-father/internal/database/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (db *mongoDb) GetBot(id primitive.ObjectID) (model.Bot, error) {
	var bot model.Bot

	c := db.collections[model.BOT].FindOne(db.ctx, bson.D{{"_id", id}})

	err := c.Decode(&bot)

	return bot, err
}

func (db *mongoDb) CheckAndInsertBot(bot *model.Bot) error {
	_, err := db.GetProduct(bot.ProductID)
	if err != nil {
		return err
	}
	return db.insertBot(bot)
}

func (db *mongoDb) insertBot(bot *model.Bot) error {
	res, err := db.collections[model.BOT].InsertOne(db.ctx, bot)

	if err != nil {
		return err
	}

	bot.ID, _ = res.InsertedID.(primitive.ObjectID)

	return nil
}

func (db *mongoDb) CheckAndUpdateBot(bot *model.Bot) error {
	_, err := db.GetProduct(bot.ProductID)
	if err != nil {
		return err
	}
	return db.updateBot(bot)
}

func (db *mongoDb) updateBot(bot *model.Bot) error {
	_, err := db.collections[model.BOT].ReplaceOne(db.ctx, bson.D{{"_id", bot.ID}}, bot)

	if err != nil {
		return err
	}

	return nil
}

func (db *mongoDb) GetBots(productId primitive.ObjectID) ([]model.Bot, error) {
	var bots []model.Bot

	cursor, err := db.collections[model.BOT].Find(db.ctx, bson.D{{"product_id", productId}})

	if err != nil {
		return bots, err
	}
	err = cursor.All(db.ctx, &bots)

	return bots, err
}

func (db *mongoDb) DeleteBot(id primitive.ObjectID) error {

	_, err := db.collections[model.BOT].DeleteOne(db.ctx, bson.D{{"_id", id}})

	return err
}
