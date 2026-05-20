package handlers

import (
	"log"
	"net/http"

	"sh4ryuu-portfolio/internal/models"

	"github.com/gin-gonic/gin"
)

// BlogStore lists and fetches blog posts.
type BlogStore interface {
	List() ([]models.BlogPost, error)
	Get(slug string) (*models.BlogPost, error)
	GetByCategory(category string) ([]models.BlogPost, error)
	CheckPassword(slug, password string) (bool, error)
}

// ListBlogs returns all blog post metadata.
func ListBlogs(store BlogStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		if store == nil {
			c.JSON(http.StatusOK, []interface{}{})
			return
		}
		blogs, err := store.List()
		if err != nil {
			log.Printf("[blogs] List error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, blogs)
	}
}

// GetBlog returns a single blog post by slug.
func GetBlog(store BlogStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		slug := c.Param("slug")
		if slug == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "slug required"})
			return
		}
		if store == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "blog not found"})
			return
		}
		blog, err := store.Get(slug)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "blog not found"})
			return
		}
		c.JSON(http.StatusOK, blog)
	}
}

// GetBlogsByCategory returns blog posts filtered by category.
func GetBlogsByCategory(store BlogStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		category := c.Param("category")
		if category == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "category required"})
			return
		}
		if store == nil {
			c.JSON(http.StatusOK, []interface{}{})
			return
		}
		blogs, err := store.GetByCategory(category)
		if err != nil {
			log.Printf("[blogs] GetByCategory error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, blogs)
	}
}

// CheckPassword verifies password for protected blog posts.
func CheckPassword(store BlogStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Slug     string `json:"slug" binding:"required"`
			Password string `json:"password" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		if store == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Storage error"})
			return
		}

		valid, err := store.CheckPassword(req.Slug, req.Password)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Blog not found"})
			return
		}

		if !valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}
