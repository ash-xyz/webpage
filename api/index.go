package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sort"
	"strconv"
	"strings"
)

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1241194659707883581/VhrvP7ZevGK4Tx0ZUOhsdCgP6F9cM0ELS_376IQ69c-30d6Y9QvX0IBJlOW_kanuev79"

type IPInfo struct {
	IP       string   `json:"ip"`
	Location Location `json:"location"`
	Network  Network  `json:"network"`
}

type Network struct {
	AutonomousSystem AutonomousSystem `json:"autonomous_system"`
}

type Location struct {
	City      string  `json:"city"`
	Country   string  `json:"country"`
	TimeZone  string  `json:"timezone"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type AutonomousSystem struct {
	ASN          int    `json:"asn"`
	Name         string `json:"name"`
	Organization string `json:"organization"`
	Country      string `json:"country"`
	RIR          string `json:"rir"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		var ipInfo IPInfo
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err = json.Unmarshal(body, &ipInfo)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		headers := r.Header
		// Browsers override the referer header, so I'm sneaking it in through x-referer
		headers.Set("Referer", headers.Get("X-Referer"))
		headers.Del("X-Referer")

		keys := make([]string, 0, len(headers))
		for k := range headers {
			keys = append(keys, k)
		}
		sort.Strings(keys)

		headerString := "# Someone just visited Ash's Webpage:\n"
		headerString += "## Browser Headers:\n"

		for _, header := range keys {
			headerString += fmt.Sprintf("**%s**: %s\n", header, strings.Join(headers.Values(header), ", "))
		}

		headerString += "\n## IP Info:\n"
		headerString += fmt.Sprintf("**IP Address**: %s\n", ipInfo.IP)
		headerString += "### Location:\n"
		headerString += fmt.Sprintf("**Location**: %s\n", ipInfo.Location.City)
		headerString += fmt.Sprintf("**Country**: %s\n", ipInfo.Location.Country)
		headerString += fmt.Sprintf("**TimeZone**: %s\n", ipInfo.Location.TimeZone)
		headerString += fmt.Sprintf("**Latitude**: %v\n", ipInfo.Location.Latitude)
		headerString += fmt.Sprintf("**Longitude**: %v\n", ipInfo.Location.Longitude)
		headerString += "### ASN:\n"
		headerString += fmt.Sprintf("**Location**: %v\n", ipInfo.Network.AutonomousSystem.ASN)
		headerString += fmt.Sprintf("**Country**: %s\n", ipInfo.Network.AutonomousSystem.Country)
		headerString += fmt.Sprintf("**Organization**: %s\n", ipInfo.Network.AutonomousSystem.Organization)
		headerString += fmt.Sprintf("**RIR**: %s\n", ipInfo.Network.AutonomousSystem.RIR)

		sendToDiscordWebhook(headerString)
	}

	w.Header().Add("X-Robots-Tag", "noindex")

	fmt.Fprintf(w, "<h1>Something is going on here 👀</h1>")
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
