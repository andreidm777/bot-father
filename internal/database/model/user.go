package model

import (
	"bot-father/pkg/util"
	"errors"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	Email    string             `bson:"email,omitempty"`
	CTime    int64              `bson:"create_time,omitempty"`
	Flags    int64              `bson:"flags,omitempty"`
	Passwd   string             `bson:"passwd,omitempty"`
	Salt     string             `bson:"salt,omitempty"`
	IsActive bool               `bson:"is_active,omitempty"`
}

func (u *User) CheckPasswd(passwd string) error {
	if util.GetMd5(passwd+u.Salt) != u.Passwd {
		return errors.New("bad password")
	}
	return nil
}
