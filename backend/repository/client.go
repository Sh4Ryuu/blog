package repository

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/supabase-community/supabase-go"
)

// Client wraps Supabase client for database access.
type Client struct {
	*supabase.Client
	serviceKey string
	baseURL    string
}

// NewClient creates a Supabase client from SUPABASE_URL and SUPABASE_KEY env vars.
func NewClient() (*Client, error) {
	url := os.Getenv("SUPABASE_URL")
	key := os.Getenv("SUPABASE_KEY")
	serviceKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	if url == "" || key == "" {
		return nil, nil
	}
	client, err := supabase.NewClient(url, key, &supabase.ClientOptions{})
	if err != nil {
		return nil, err
	}
	return &Client{Client: client, serviceKey: serviceKey, baseURL: url}, nil
}

// SignStorageURL generates a signed URL for private bucket access
func (c *Client) SignStorageURL(bucket, path string, expiresIn int) (string, error) {
	if c.serviceKey == "" {
		return "", fmt.Errorf("SUPABASE_SERVICE_ROLE_KEY not set")
	}

	signURL := fmt.Sprintf("%s/storage/v1/object/sign/%s/%s",
		c.baseURL, bucket, path)

	body, _ := json.Marshal(map[string]int{
		"expiresIn": expiresIn,
	})

	req, err := http.NewRequest("POST", signURL, bytes.NewBuffer(body))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.serviceKey)
	req.Header.Set("apikey", c.serviceKey)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to sign URL: %d", resp.StatusCode)
	}

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	signedURL, ok := result["signedURL"].(string)
	if !ok {
		return "", fmt.Errorf("no signed URL in response")
	}

	return c.baseURL + "/storage/v1" + signedURL, nil

	// return c.baseURL + signedURL, nil
}
