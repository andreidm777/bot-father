package util

import (
	"crypto/md5"
	"fmt"
	"math/rand"
)

const letterBytes = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const intBytes = "0123456789"

func RandIntBytes(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = intBytes[rand.Intn(len(intBytes))]
	}
	return string(b)
}

func RandStringBytes(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func GetMd5(str string) string {
	return fmt.Sprintf("%x", md5.Sum([]byte(str)))
}
