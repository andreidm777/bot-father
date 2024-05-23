package mongodb

import (
	"bot-father/internal/database/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (db *mongoDb) GetUserByEmail(email string) (model.User, error) {
	var user model.User

	c := db.collections[model.USER].FindOne(db.ctx, bson.D{{"email", email}})

	err := c.Decode(&user)

	return user, err
}

func (db *mongoDb) InsertUser(user *model.User) error {
	res, err := db.collections[model.USER].InsertOne(db.ctx, user)

	if err != nil {
		return err
	}

	user.ID, _ = res.InsertedID.(primitive.ObjectID)

	return nil
}
