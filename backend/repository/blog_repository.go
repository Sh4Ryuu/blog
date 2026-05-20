package repository

import (
	"bytes"
	"fmt"
	"regexp"
	"strings"

	"sh4ryuu-portfolio/internal/models"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/renderer/html"
)

type blogRow struct {
	Slug        string   `json:"slug"`
	Title       string   `json:"title"`
	Excerpt     string   `json:"excerpt"`
	Category    string   `json:"category"`
	Content     string   `json:"content"`
	Tags        []string `json:"tags"`
	Difficulty  string   `json:"difficulty"`
	OS          string   `json:"os"`
	Date        string   `json:"date"`
	IsProtected bool     `json:"is_protected"`
	Password    string   `json:"password"`
}

// BlogRepository handles blog CRUD via Supabase.
type BlogRepository struct {
	client *Client
	md     goldmark.Markdown
}

// NewBlogRepository creates a blog repository.
func NewBlogRepository(client *Client) *BlogRepository {
	return &BlogRepository{
		client: client,
		md: goldmark.New(
			goldmark.WithExtensions(extension.GFM),
			goldmark.WithRendererOptions(html.WithUnsafe()),
		),
	}
}

// List returns all blog metadata (no content).
func (r *BlogRepository) List() ([]models.BlogPost, error) {
	if r == nil || r.client == nil {
		return nil, nil
	}
	var rows []blogRow
	_, err := r.client.From("blogs").Select("slug,title,excerpt,category,is_protected,tags,date,difficulty,os", "exact", false).ExecuteTo(&rows)
	if err != nil {
		return nil, err
	}
	out := make([]models.BlogPost, 0, len(rows))
	for _, row := range rows {
		out = append(out, models.BlogPost{
			Slug:        row.Slug,
			Title:       row.Title,
			Excerpt:     row.Excerpt,
			Category:    row.Category,
			IsProtected: row.IsProtected,
			Tags:        row.Tags,
			Date:        row.Date,
			Difficulty:  row.Difficulty,
			OS:          row.OS,
		})
	}
	return out, nil
}

// Get returns a single blog by slug with content and content_html.
func (r *BlogRepository) Get(slug string) (*models.BlogPost, error) {
	if r == nil || r.client == nil {
		return nil, nil
	}
	var row blogRow
	_, err := r.client.From("blogs").Select("*", "exact", false).Eq("slug", slug).Single().ExecuteTo(&row)
	if err != nil {
		return nil, err
	}

	// Replace storage URLs with signed URLs before converting to HTML
	content := r.replaceStorageURLs(row.Content)

	var htmlBuf bytes.Buffer
	if err := r.md.Convert([]byte(content), &htmlBuf); err != nil {
		return nil, err
	}
	return &models.BlogPost{
		Slug:        row.Slug,
		Title:       row.Title,
		Excerpt:     row.Excerpt,
		Category:    row.Category,
		IsProtected: row.IsProtected,
		Password:    row.Password,
		Tags:        row.Tags,
		Date:        row.Date,
		Difficulty:  row.Difficulty,
		OS:          row.OS,
		Content:     content,
		ContentHTML: htmlBuf.String(),
	}, nil
}

// replaceStorageURLs finds storage:bucket/path patterns and replaces with signed URLs
func (r *BlogRepository) replaceStorageURLs(content string) string {
	if r.client == nil {
		return content
	}

	// Pattern to match storage:bucket/path
	re := regexp.MustCompile(`storage:([a-zA-Z0-9-]+)/([a-zA-Z0-9-_.\/]+)`)

	return re.ReplaceAllStringFunc(content, func(match string) string {
		parts := strings.Split(match, ":")
		if len(parts) != 2 {
			return match
		}

		pathParts := strings.Split(parts[1], "/")
		if len(pathParts) < 2 {
			return match
		}

		bucket := pathParts[0]
		path := strings.Join(pathParts[1:], "/")

		// Generate signed URL with 1 hour expiry
		signedURL, err := r.client.SignStorageURL(bucket, path, 3600)
		if err != nil {
			fmt.Printf("Error signing URL for %s: %v", match, err)
			return match
		}

		return signedURL
	})
}

// Insert inserts one blog post.
func (r *BlogRepository) Insert(post *models.BlogPost) error {
	if r == nil || r.client == nil || post == nil {
		return nil
	}
	row := map[string]interface{}{
		"slug":         post.Slug,
		"title":        post.Title,
		"excerpt":      post.Excerpt,
		"category":     post.Category,
		"is_protected": post.IsProtected,
		"password":     post.Password,
		"content":      post.Content,
		"tags":         post.Tags,
		"difficulty":   post.Difficulty,
		"os":           post.OS,
		"date":         post.Date,
	}
	_, _, err := r.client.From("blogs").Insert(row, false, "", "representation", "").Execute()
	return err
}

// CheckPassword verifies if the provided password matches the blog's password.
func (r *BlogRepository) CheckPassword(slug, password string) (bool, error) {
	if r == nil || r.client == nil {
		return false, nil
	}
	var row blogRow
	_, err := r.client.From("blogs").Select("slug,password,is_protected", "exact", false).Eq("slug", slug).Single().ExecuteTo(&row)
	if err != nil {
		return false, err
	}

	// If blog is not protected, allow access
	if !row.IsProtected {
		return true, nil
	}

	// Compare passwords (constant-time comparison would be better for production)
	valid := row.Password == password
	return valid, nil
}

// GetByCategory returns blog posts filtered by category.
func (r *BlogRepository) GetByCategory(category string) ([]models.BlogPost, error) {
	if r == nil || r.client == nil {
		return nil, nil
	}
	var rows []blogRow
	_, err := r.client.From("blogs").Select("slug,title,excerpt,category,tags,date,difficulty,os", "exact", false).Eq("category", category).ExecuteTo(&rows)
	if err != nil {
		return nil, err
	}
	out := make([]models.BlogPost, 0, len(rows))
	for _, row := range rows {
		out = append(out, models.BlogPost{
			Slug:       row.Slug,
			Title:      row.Title,
			Excerpt:    row.Excerpt,
			Category:   row.Category,
			Tags:       row.Tags,
			Date:       row.Date,
			Difficulty: row.Difficulty,
			OS:         row.OS,
		})
	}
	return out, nil
}
