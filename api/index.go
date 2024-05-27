package handler

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
)

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1241197043649740920/lrT0n-XoiS4zAS0iiuizTxUnQk7Rs2Ur_MRMTSCeqdDnNMy_EsFXBYNtdv0Ec1KJwTUH"

func Handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "<h1>Something is going on here 👀</h1>")
	// Get request headers
	headers := r.Header
	headerString := "## Someone just visited Ash's Webpage:\n"
	for name, values := range headers {
		headerString += fmt.Sprintf("**%s**: %s\n", name, strings.Join(values, ", "))
	}

	// Send headers to Discord webhook
	sendToDiscordWebhook(headerString)
}

func sendToDiscordWebhook(message string) {
	escapedMessage := strconv.Quote(message)
	payload := []byte(`{"content":` + escapedMessage + `}`)
	req, err := http.NewRequest("POST", DISCORD_WEBHOOK, bytes.NewBuffer(payload))
	if err != nil {
		fmt.Println("Error creating Discord webhook request:", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending Discord webhook request:", err)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading Discord webhook response body:", err)
		return
	}

	if len(body) != 0 {
		fmt.Println("Discord webhook response:", string(body))
	} else {
		fmt.Println("Discord Message sent!")
	}
}
