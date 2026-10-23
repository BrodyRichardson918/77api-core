package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORS() gin.HandlerFunc {
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowCredentials = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"*"}
	return cors.New(config)
}

// Version no longer sends any version header (77API drops the upstream one).
// The function is kept so main.go's registration stays unchanged against upstream.
func Version() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
	}
}
