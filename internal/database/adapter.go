package database

import (
	"bot-father/internal/database/model"
	"bot-father/internal/database/mongodb"
)

type Adapter interface {
	GetUserByEmail(email string) (model.User, error)
	InsertUser(user *model.User) error
	InsertSession(session *model.Session) error
	GetSession(sid string) (model.Session, error)
	UpdateSession(s model.Session)
}

func GetInstance() Adapter {
	return mongodb.GetInstance()
}
