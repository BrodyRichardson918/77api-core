package operation_setting

import "testing"

func TestDefaultDocsLink_77api(t *testing.T) {
	if got := GetGeneralSetting().DocsLink; got != "https://api.77port.uk/docs" {
		t.Fatalf("default DocsLink = %q, want %q", got, "https://api.77port.uk/docs")
	}
}
