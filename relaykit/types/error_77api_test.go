package types

import (
	"encoding/json"
	"errors"
	"testing"
)

func TestErrorTypeIs77api(t *testing.T) {
	if ErrorTypeNewAPIError != "77api_error" {
		t.Fatalf("ErrorTypeNewAPIError = %q, want 77api_error", ErrorTypeNewAPIError)
	}
}

func TestOpenAIAndClaudeErrorBodiesCarry77apiType(t *testing.T) {
	apiErr := NewError(errors.New("something failed"), ErrorCodeBadResponse)

	openAIBody, err := json.Marshal(apiErr.ToOpenAIError())
	if err != nil {
		t.Fatal(err)
	}
	var openAI struct {
		Type string `json:"type"`
	}
	if err := json.Unmarshal(openAIBody, &openAI); err != nil {
		t.Fatal(err)
	}
	if openAI.Type != "77api_error" {
		t.Fatalf("OpenAI error type = %q, want 77api_error (body %s)", openAI.Type, openAIBody)
	}

	claudeBody, err := json.Marshal(apiErr.ToClaudeError())
	if err != nil {
		t.Fatal(err)
	}
	var claude struct {
		Type string `json:"type"`
	}
	if err := json.Unmarshal(claudeBody, &claude); err != nil {
		t.Fatal(err)
	}
	if claude.Type != "77api_error" {
		t.Fatalf("Claude error type = %q, want 77api_error (body %s)", claude.Type, claudeBody)
	}
}
