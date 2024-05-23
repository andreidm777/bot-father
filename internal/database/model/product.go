package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Product struct {
	ID   primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty" binding:"mongodb"`
	Name string             `bson:"name,omitempty" json:"name" binding:"required"`
}
