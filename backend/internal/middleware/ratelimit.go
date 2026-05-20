package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type visitor struct {
	count    int
	lastSeen time.Time
}

var (
	visitors = make(map[string]*visitor)
	mu       sync.Mutex
)

const (
	rateLimit = 100
	window    = time.Minute
)

// RateLimit applies a simple in-memory rate limit per IP.
func RateLimit() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		mu.Lock()
		v, ok := visitors[ip]
		if !ok {
			visitors[ip] = &visitor{count: 1, lastSeen: time.Now()}
			mu.Unlock()
			c.Next()
			return
		}
		if time.Since(v.lastSeen) > window {
			v.count = 0
			v.lastSeen = time.Now()
		}
		v.count++
		v.lastSeen = time.Now()
		if v.count > rateLimit {
			mu.Unlock()
			c.AbortWithStatus(http.StatusTooManyRequests)
			return
		}
		mu.Unlock()
		c.Next()
	}
}
