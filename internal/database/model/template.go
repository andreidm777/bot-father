package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Template struct {
	ID        primitive.ObjectID `bson:"_id" json:"id,omitempty" binding:"mongodb"`
	ProductID primitive.ObjectID `bson:"product_id" json:"product_id,omitempty" binding:"mongodb"`
	BotID     primitive.ObjectID `bson:"bot_id,omitempty" json:"bot_id,omitempty" binding:"mongodb"`
	Name      string             `bson:"name" json:"name" binding:"required"`
	Type      string             `bson:"type,omitempty" json:"type,omitempty" binding:"required,oneof=self group"`
}
