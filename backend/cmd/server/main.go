package main

import (
	"log"
	"os"

	"sh4ryuu-portfolio/internal/handlers"
	"sh4ryuu-portfolio/internal/middleware"
	"sh4ryuu-portfolio/repository"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	client, err := repository.NewClient()
	if err != nil {
		log.Fatalf("Supabase client: %v", err)
	}
	if client == nil {
		log.Fatal("SUPABASE_URL and SUPABASE_KEY must be set in .env")
	}

	blogRepo := repository.NewBlogRepository(client)

	r := gin.Default()

	// Middleware
	r.Use(middleware.CORS())
	r.Use(middleware.Logger())
	r.Use(middleware.RateLimit())

	// Health
	r.GET("/health", handlers.Health)

	// API
	api := r.Group("/api")
	{
		api.GET("/blogs", handlers.ListBlogs(blogRepo))
		api.GET("/blogs/:slug", handlers.GetBlog(blogRepo))
		api.GET("/blogs/category/:category", handlers.GetBlogsByCategory(blogRepo))
		api.POST("/blogs/check-password", handlers.CheckPassword(blogRepo))
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
