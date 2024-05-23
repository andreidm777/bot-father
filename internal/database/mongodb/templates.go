package mongodb

import (
	"bot-father/internal/database/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (db *mongoDb) GetTemplate(id primitive.ObjectID) (model.Template, error) {
	var tmpl model.Template

	c := db.collections[model.TEMPLATE].FindOne(db.ctx, bson.D{{"_id", id}})

	err := c.Decode(&tmpl)

	return tmpl, err
}

func (db *mongoDb) CheckAndInsertTemplate(tmpl *model.Template) error {
	_, err := db.GetProduct(tmpl.ProductID)
	if err != nil {
		return err
	}
	if !tmpl.BotID.IsZero() {
		_, err := db.GetBot(tmpl.BotID)
		if err != nil {
			return err
		}
	}
	return db.insertTemplate(tmpl)
}

func (db *mongoDb) insertTemplate(tmpl *model.Template) error {
	res, err := db.collections[model.TEMPLATE].InsertOne(db.ctx, tmpl)

	if err != nil {
		return err
	}

	tmpl.ID, _ = res.InsertedID.(primitive.ObjectID)

	return nil
}

func (db *mongoDb) CheckAndUpdateTemplate(tmpl *model.Template) error {
	_, err := db.GetProduct(tmpl.ProductID)
	if err != nil {
		return err
	}
	return db.updateTemplate(tmpl)
}

func (db *mongoDb) updateTemplate(tmpl *model.Template) error {
	_, err := db.collections[model.TEMPLATE].ReplaceOne(db.ctx, bson.D{{"_id", tmpl.ID}}, tmpl)

	if err != nil {
		return err
	}

	return nil
}

func (db *mongoDb) DeleteTemplate(id primitive.ObjectID) error {
	db.ClearTemplate(id)

	_, err := db.collections[model.TEMPLATE].DeleteOne(db.ctx, bson.D{{"_id", id}})

	return err
}

func (db *mongoDb) GetTemplates(productId primitive.ObjectID) ([]model.Template, error) {
	var templates []model.Template

	cursor, err := db.collections[model.TEMPLATE].Find(db.ctx, bson.D{{"product_id", productId}})

	if err != nil {
		return templates, err
	}
	err = cursor.All(db.ctx, &templates)

	return templates, err
}
