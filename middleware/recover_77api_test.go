package middleware

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestRelayPanicRecover_77apiBranding(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(RelayPanicRecover())
	router.GET("/panic", func(c *gin.Context) {
		panic("boom")
	})

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, httptest.NewRequest(http.MethodGet, "/panic", nil))

	require.Equal(t, http.StatusInternalServerError, resp.Code)

	var body struct {
		Error struct {
			Message string `json:"message"`
			Type    string `json:"type"`
		} `json:"error"`
	}
	require.NoError(t, common.Unmarshal(resp.Body.Bytes(), &body))
	assert.Equal(t, "77api_panic", body.Error.Type)
	assert.Equal(t, "服务内部错误，请联系 77API 支持并提供 request id", body.Error.Message)

	raw := strings.ToLower(resp.Body.String())
	for _, forbidden := range []string{"github.com", "boom", "new-api", "new_api", "calcium"} {
		assert.NotContains(t, raw, forbidden)
	}
}
