package mongodb

import (
	"bot-father/internal/database/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (db *mongoDb) GetProductByName(name string) (model.Product, error) {
	var p model.Product

	c := db.collections[model.PRODUCT].FindOne(db.ctx, bson.D{{"name", name}})

	err := c.Decode(&p)

	return p, err
}

func (db *mongoDb) GetProduct(id primitive.ObjectID) (model.Product, error) {
	var p model.Product

	c := db.collections[model.PRODUCT].FindOne(db.ctx, bson.D{{"_id", id}})

	err := c.Decode(&p)

	return p, err
}

func (db *mongoDb) InsertProduct(p *model.Product) error {
	res, err := db.collections[model.PRODUCT].InsertOne(db.ctx, p)

	if err != nil {
		return err
	}

	p.ID, _ = res.InsertedID.(primitive.ObjectID)

	return nil
}

func (db *mongoDb) UpdateProduct(p *model.Product) error {
	_, err := db.collections[model.PRODUCT].ReplaceOne(db.ctx, bson.D{{"_id", p.ID}}, p)

	if err != nil {
		return err
	}

	return nil
}

func (db *mongoDb) GetProducts(userId primitive.ObjectID) ([]model.Product, error) {
	var products []model.Product

	cursor, err := db.collections[model.PRODUCT].Find(db.ctx, bson.D{{"user_id", userId}})

	if err != nil {
		return products, err
	}
	err = cursor.All(db.ctx, &products)

	return products, err
}
