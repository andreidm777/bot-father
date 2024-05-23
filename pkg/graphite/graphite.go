package graphite

import (
	"fmt"
	"net"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	config "github.com/spf13/viper"
)

type graphType struct {
	sync.Mutex
	addr     *net.UDPAddr
	disabled bool
}

var graph graphType

func (s *graphType) getGraphiteAddr() *net.UDPAddr {
	if s.addr != nil {
		return s.addr
	}
	stradrr := fmt.Sprintf("%s:%d", config.GetString("graphite.host"), config.GetInt("graphite.port"))
	s.Lock()
	defer s.Unlock()
	a, err := net.ResolveUDPAddr("udp", stradrr)
	if err != nil {
		log.Error("[WARNING] Can't resolve graphite addr.")
		return nil
	}
	s.addr = a
	s.disabled = config.GetBool("graphite.disabled")
	return s.addr
}

func SendStat(modPrefix string, stat string, count int) error {
	addr := graph.getGraphiteAddr()

	if addr == nil || graph.disabled {
		return nil
	}

	conn, err := net.DialUDP("udp", nil, addr)
	if err != nil {
		log.Errorf("send statistics to graphite error: %v", err)
		return err
	}
	defer conn.Close()
	if modPrefix != "" {
		_, err = fmt.Fprintf(conn, "%s.%s.%s %d %d", config.GetString("graphite.prefix"), modPrefix, stat, count, time.Now().Unix())
	} else {
		_, err = fmt.Fprintf(conn, "%s.%s %d %d", config.GetString("graphite.prefix"), stat, count, time.Now().Unix())
	}
	if err != nil {
		log.Errorf("send statistics to graphite error: %v", err)
		return err
	}
	return nil
}

func GinStatMiddleware(c *gin.Context) {
	c.Next()
	SendStat("http_status", fmt.Sprintf("%d", c.Writer.Status()), 1)
}
