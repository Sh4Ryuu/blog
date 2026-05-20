package middleware

import (
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// CORS allows frontend at localhost:5173 and production domain.
func CORS() gin.HandlerFunc {
	allowedOrigins := map[string]bool{
		"http://localhost:5173": true,
		"http://localhost:4173": true,
	}

	// FRONTEND_URL can be a comma-separated list: https://sh4ryuu.me,https://sh4ryuu.vercel.app
	if raw := os.Getenv("FRONTEND_URL"); raw != "" {
		for _, u := range strings.Split(raw, ",") {
			u = strings.TrimSpace(u)
			if u != "" {
				allowedOrigins[u] = true
			}
		}
	}
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if allowedOrigins[origin] {
			c.Header("Access-Control-Allow-Origin", origin)
		} else {
			c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
		}
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
