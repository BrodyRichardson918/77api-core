package controller

import (
	"regexp"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/stretchr/testify/require"
)

func TestStripeReferencePrefix(t *testing.T) {
	ref := stripeReference(42)
	require.Regexp(t, regexp.MustCompile(`^77api-ref-42-\d+-[A-Za-z0-9]{4}$`), ref)
	require.NotContains(t, ref, "new-api")
}

func TestWaffoGoodsInfoAppNameFallback77api(t *testing.T) {
	old := common.SystemName
	t.Cleanup(func() { common.SystemName = old })

	common.SystemName = "  "
	require.Equal(t, "77API", buildWaffoTopUpGoodsInfo(10).AppName)

	common.SystemName = "MyShop"
	require.Equal(t, "MyShop", buildWaffoTopUpGoodsInfo(10).AppName)
}
