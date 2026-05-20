package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Health returns a simple liveness check.
func Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"message": "Sh4Ryuu API is alive",
	})
}
