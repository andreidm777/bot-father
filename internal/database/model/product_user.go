package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type ProductUser struct {
	ID        primitive.ObjectID `bson:"_id"`
	ProductID primitive.ObjectID `bson:"product_id"`
	UserID    primitive.ObjectID `bson:"user_id"`
}
