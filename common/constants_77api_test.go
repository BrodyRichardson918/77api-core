package common

import "testing"

func TestDefaultSystemName_77api(t *testing.T) {
	if SystemName != "77API" {
		t.Fatalf("SystemName default = %q, want %q", SystemName, "77API")
	}
}
