package service

import (
	"crypto/hmac"
	"crypto/sha256"
	"testing"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// The 77API console reads SessionHintCookieName from document.cookie, so the
// exact names are part of the contract with that app.
func TestCookieNames77api(t *testing.T) {
	assert.Equal(t, "77api_refresh", RefreshCookieName)
	assert.Equal(t, "77api_has_session", SessionHintCookieName)
}

func TestAuthTokenIssuer77api(t *testing.T) {
	useTestSessionSecret(t)
	identity := AuthIdentity{UserID: 42, SessionID: "session-1", UserAuthVersion: 1, SessionVersion: 1}

	token, _, err := IssueAccessToken(identity)
	require.NoError(t, err)

	parsedIdentity, err := ParseAccessToken(token)
	require.NoError(t, err)
	assert.Equal(t, identity, parsedIdentity)

	claims := &authClaims{}
	_, _, err = jwt.NewParser().ParseUnverified(token, claims)
	require.NoError(t, err)
	assert.Equal(t, "77api", claims.Issuer)
	assert.Contains(t, []string(claims.Audience), "77api-dashboard")

	_, internal, err := ParseDashboardAccessToken(token)
	assert.True(t, internal)
	assert.NoError(t, err)
}

// The HMAC domain separator is renamed along with the issuer: a token signed
// with the new prefix verifies, one signed with the upstream prefix does not.
func TestAuthTokenSigningDomain77api(t *testing.T) {
	useTestSessionSecret(t)
	sign := func(domain string) string {
		mac := hmac.New(sha256.New, []byte(common.SessionSecret))
		_, _ = mac.Write([]byte(domain))
		now := time.Now()
		claims := authClaims{
			TokenUse: accessTokenUse, SessionID: "session-1", UserAuthVersion: 1, SessionVersion: 1,
			RegisteredClaims: jwt.RegisteredClaims{
				Issuer: "77api", Subject: "42", Audience: jwt.ClaimStrings{"77api-dashboard"},
				ExpiresAt: jwt.NewNumericDate(now.Add(time.Minute)),
				NotBefore: jwt.NewNumericDate(now.Add(-time.Minute)),
				IssuedAt:  jwt.NewNumericDate(now),
				ID:        "test-jti",
			},
		}
		signed, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(mac.Sum(nil))
		require.NoError(t, err)
		return signed
	}

	_, err := ParseAccessToken(sign("77api/auth/access/v1"))
	assert.NoError(t, err)
	_, err = ParseAccessToken(sign("new-api/auth/access/v1"))
	assert.ErrorIs(t, err, ErrAuthTokenInvalid)
}
