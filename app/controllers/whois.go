package controllers

import "github.com/robfig/revel"

type Whois struct {
	*revel.Controller
}

func (c Whois) Index() revel.Result {

	mapsApiKey, _ := revel.Config.String("app.mapsapikey")
	return c.Render(mapsApiKey)

}

