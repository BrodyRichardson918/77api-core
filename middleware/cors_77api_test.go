package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func newHeaderTestRouter(handlers ...gin.HandlerFunc) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(handlers...)
	r.GET("/ping", func(c *gin.Context) { c.String(http.StatusOK, "ok") })
	return r
}

func TestNoVersionHeader(t *testing.T) {
	r := newHeaderTestRouter(RequestId(), Version())
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/ping", nil))

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Empty(t, rec.Header().Get("X-New-Api-Version"))
}

func TestRequestIdHeaderName(t *testing.T) {
	r := newHeaderTestRouter(RequestId())
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/ping", nil))

	assert.NotEmpty(t, rec.Header().Get("X-77api-Request-Id"))
	assert.Empty(t, rec.Header().Get("X-Oneapi-Request-Id"))
}
