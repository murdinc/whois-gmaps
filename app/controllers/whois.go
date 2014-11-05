package controllers

import "github.com/robfig/revel"

type Whois struct {
	*revel.Controller
}

func (c Whois) Index() revel.Result {

	// Pull in our google maps api URL with key from app.conf
	mapsApiKey, _ := revel.Config.String("app.mapsapikey")

	return c.Render(mapsApiKey)

}

