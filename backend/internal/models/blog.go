package models

// BlogPost represents a blog post with metadata and content.
type BlogPost struct {
	Slug        string   `json:"slug"`
	Title       string   `json:"title"`
	Excerpt     string   `json:"excerpt,omitempty"`
	Category    string   `json:"category,omitempty"`
	Tags        []string `json:"tags,omitempty"`
	Date        string   `json:"date,omitempty"`
	Difficulty  string   `json:"difficulty,omitempty"`
	OS          string   `json:"os,omitempty"`
	Content     string   `json:"content,omitempty"`
	ContentHTML string   `json:"content_html,omitempty"`
	IsProtected bool     `json:"is_protected,omitempty"`
	Password     string   `json:"password,omitempty"`
}
