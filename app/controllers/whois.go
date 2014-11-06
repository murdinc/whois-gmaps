package controllers

import "github.com/robfig/revel"

type Whois struct {
	*revel.Controller
}

func (c Whois) Index() revel.Result {

	switch c.Params.Get("METHOD") {
	case "POST":
		revel.INFO.Print("POST")
	case "GET":
		revel.INFO.Print("GET")

	}

	ip := c.Params.Get("ip")

	revel.INFO.Print(ip)

	// Pull in our google maps api URL with key from app.conf
	mapsApiKey, _ := revel.Config.String("app.mapsapikey")

	return c.Render(mapsApiKey)

}

func checkIP(ip string) bool {

	return true
}
