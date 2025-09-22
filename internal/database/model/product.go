package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Product struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name   string             `bson:"name,omitempty" json:"name" binding:"required"`
	UserID primitive.ObjectID `bson:"user_id,omitempty" json:"user_id,omitempty" binding:"-"`
}
