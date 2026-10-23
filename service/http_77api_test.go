package service

import (
	"net/http/httptest"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestShouldCopyUpstreamHeader_77apiRequestId(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("upstream x-request-id passes through untouched", func(t *testing.T) {
		c, _ := gin.CreateTestContext(httptest.NewRecorder())
		assert.True(t, ShouldCopyUpstreamHeader(c, "X-Request-Id", []string{"req_openai_1"}))
		_, captured := c.Get(common.UpstreamRequestIdKey)
		assert.False(t, captured)
	})

	t.Run("upstream X-77api-Request-Id is captured and not forwarded", func(t *testing.T) {
		c, _ := gin.CreateTestContext(httptest.NewRecorder())
		assert.False(t, ShouldCopyUpstreamHeader(c, "X-77api-Request-Id", []string{"up-77"}))
		assert.Equal(t, "up-77", c.GetString(common.UpstreamRequestIdKey))
	})

	t.Run("old upstream header name is no longer special", func(t *testing.T) {
		c, _ := gin.CreateTestContext(httptest.NewRecorder())
		assert.True(t, ShouldCopyUpstreamHeader(c, "X-Oneapi-Request-Id", []string{"old"}))
		_, captured := c.Get(common.UpstreamRequestIdKey)
		assert.False(t, captured)
	})
}
