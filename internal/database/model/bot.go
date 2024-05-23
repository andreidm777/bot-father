package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Bot struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty" binding:"mongodb"`
	ProductID primitive.ObjectID `bson:"product_id" json:"product_id,omitempty"  binding:"mongodb"`
	Type      string             `bson:"type,omitempty" json:"type" binding:"required,oneof=vk telegram"`
	Token     string             `bson:"token,omitempty" json:"token" binding:"required"`
}
