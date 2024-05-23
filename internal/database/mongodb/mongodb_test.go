package mongodb

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TestStruct struct {
	ID primitive.ObjectID `bson:"_id" json:"id" validate:"mongodb"`
}

func TestJsonAndBJson(t *testing.T) {
	bs := TestStruct{
		ID: primitive.NewObjectID(),
	}

	b, err := json.Marshal(&bs)

	assert.Nilf(t, err, "not marshal %s", err)

	fmt.Printf("%s\n", string(b))

	var br TestStruct

	err = json.Unmarshal(b, &br)

	assert.Nilf(t, err, "not marshal %s", err)

	fmt.Printf("%#v\n", br)

	v, err := json.Marshal(&br)

	assert.Nilf(t, err, "not marshal %s", err)

	fmt.Printf("%s\n", string(v))
}
