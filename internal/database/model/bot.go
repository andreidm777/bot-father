package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Bot struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty" binding:"mongodb"`
	ProductID     primitive.ObjectID `bson:"product_id" json:"product_id,omitempty"  binding:"mongodb"`
	Type          string             `bson:"type,omitempty" json:"type,omitempty" binding:"oneof=vk telegram"`
	Token         string             `bson:"botToken" json:"botToken" binding:"required"`
	Group         string             `bson:"botGroup" json:"botGroup" binding:"required"`
	CallbackUrl   string             `bson:"callbackUrl,omitempty" json:"callbackUrl" binding:"url"`
	WebhookSecret string             `bson:"webhookSecret,omitempty" json:"webhookSecret" binding:"required"`
}
