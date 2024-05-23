package mongodb

import (
	"bot-father/internal/database/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (db *mongoDb) InsertSession(session *model.Session) error {
	res, err := db.collections[model.SESSION].InsertOne(db.ctx, session)

	if err != nil {
		return err
	}

	session.ID, _ = res.InsertedID.(primitive.ObjectID)

	return nil
}

func (db *mongoDb) GetSession(sid string) (model.Session, error) {
	var user model.Session

	sidHex, err := primitive.ObjectIDFromHex(sid)

	if err != nil {
		return user, err
	}

	c := db.collections[model.SESSION].FindOne(db.ctx, bson.D{{"_id", sidHex}})

	err = c.Decode(&user)

	return user, err
}

func (db *mongoDb) UpdateSession(s model.Session) {
	db.collections[model.SESSION].UpdateOne(db.ctx, bson.D{{"_id", s.ID}}, s)
}
