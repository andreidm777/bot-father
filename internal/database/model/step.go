package model

import (
	"encoding/json"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Step struct {
	ID         primitive.ObjectID   `bson:"_id" json:"id,omitempty" binding:"mongodb"`
	TemplateID primitive.ObjectID   `bson:"template_id" json:"template_id,omitempty" binding:"mongodb"`
	Order      int                  `bson:"order" json:"order,omitempty"`
	Links      []primitive.ObjectID `bson:"links" json:"links,omitempty"`
	Payload    json.RawMessage      `bson:"payload" json:"payload"`
}
