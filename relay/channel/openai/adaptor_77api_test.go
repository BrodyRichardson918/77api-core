package openai

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/QuantumNous/new-api/constant"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func openRouterHeaders(t *testing.T, preset map[string]string) http.Header {
	t.Helper()
	gin.SetMode(gin.TestMode)
	rec := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rec)
	c.Request = httptest.NewRequest(http.MethodPost, "/v1/chat/completions", nil)

	info := &relaycommon.RelayInfo{
		ChannelMeta: &relaycommon.ChannelMeta{
			ChannelType: constant.ChannelTypeOpenRouter,
			ApiKey:      "sk-test",
		},
	}
	header := http.Header{}
	for k, v := range preset {
		header.Set(k, v)
	}
	require.NoError(t, (&Adaptor{}).SetupRequestHeader(c, &header, info))
	return header
}

func TestOpenRouterAttribution77api(t *testing.T) {
	header := openRouterHeaders(t, nil)
	require.Equal(t, "https://api.77port.uk", header.Get("HTTP-Referer"))
	require.Equal(t, "77API", header.Get("X-OpenRouter-Title"))
}

func TestOpenRouterAttributionKeepsExplicitHeaders(t *testing.T) {
	header := openRouterHeaders(t, map[string]string{
		"HTTP-Referer":       "https://example.com",
		"X-OpenRouter-Title": "Custom",
	})
	require.Equal(t, "https://example.com", header.Get("HTTP-Referer"))
	require.Equal(t, "Custom", header.Get("X-OpenRouter-Title"))
}
