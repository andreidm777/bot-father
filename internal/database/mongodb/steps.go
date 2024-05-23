package mongodb

import (
	"bot-father/internal/database/model"
	"errors"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (db *mongoDb) GetSteps(templateId primitive.ObjectID) ([]model.Step, error) {
	var steps []model.Step

	cursor, err := db.collections[model.STEP].Find(db.ctx, bson.D{{"template_id", templateId}})

	if err != nil {
		return steps, err
	}
	err = cursor.All(db.ctx, &steps)

	return steps, err
}

var ErrorBadTemplateId = errors.New("differed template")
var ErrorBadStep = errors.New("bad step in array")

func (db *mongoDb) CheckAndInsertSteps(steps []model.Step) error {
	if len(steps) == 0 {
		return nil
	}

	templateId := steps[0].TemplateID

	existsStep := make(map[primitive.ObjectID]struct{}, len(steps))

	// check good template_id
	for _, s := range steps {
		existsStep[s.ID] = struct{}{}
		if templateId != s.TemplateID {
			return ErrorBadTemplateId
		}
	}

	documents := make([]any, 0, len(steps))

	for _, s := range steps {
		for _, sId := range s.Links {
			if _, ok := existsStep[sId]; !ok {
				return ErrorBadStep
			}
		}
		documents = append(documents, s)
	}

	_, err := db.collections[model.STEP].InsertMany(db.ctx, documents)

	return err
}

func (db *mongoDb) CheckAndUpdateSteps(steps []model.Step) error {
	if len(steps) == 0 {
		return nil
	}

	templateId := steps[0].TemplateID

	existsStep := make(map[primitive.ObjectID]struct{}, len(steps))

	// check good template_id
	for _, s := range steps {
		existsStep[s.ID] = struct{}{}
		if templateId != s.TemplateID {
			return ErrorBadTemplateId
		}
	}

	documents := make([]any, 0, len(steps))

	for _, s := range steps {
		for _, sId := range s.Links {
			if _, ok := existsStep[sId]; !ok {
				return ErrorBadStep
			}
		}
		documents = append(documents, s)
	}

	_, err := db.collections[model.STEP].DeleteMany(db.ctx, bson.D{{"template_id", templateId}})

	if err != nil {
		return err
	}

	_, err = db.collections[model.STEP].InsertMany(db.ctx, documents)

	return err
}

func (db *mongoDb) ClearTemplate(templateId primitive.ObjectID) {
	_, err := db.collections[model.STEP].DeleteMany(db.ctx, bson.D{{"template_id", templateId}})

	if err != nil {
		logrus.Errorf("cannot clear template [%s] %s", templateId, err.Error())
	}
}
