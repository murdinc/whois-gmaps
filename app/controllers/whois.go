package controllers

import (
	"net"
	"github.com/robfig/revel"
	"github.com/oschwald/geoip2-golang"
)

type Whois struct {
	*revel.Controller
}

func (c Whois) Index() revel.Result {

	// If this is a POST we want to return JSON info
	if c.Params.Get("METHOD") == "POST" {
		ip :=  net.ParseIP(c.Params.Get("ip"))
		revel.INFO.Printf("Looking up IP address: %s %v", ip, c.Params)
		return c.RenderJson( c.getInfo(ip) )
	}

	// If this is a GET we want to set up our maps key
	// Pull in our google maps api URL with key from app.conf
	mapsApiKey, _ := revel.Config.String("app.mapsapikey")
	return c.Render(mapsApiKey)

}

func (c Whois) getInfo(ip net.IP) *geoip2.City {
	db, err := geoip2.Open("geoip/GeoLite2-City.mmdb")
	if err != nil {
		revel.ERROR.Print(err)
	}

	defer db.Close()
	record, err := db.City(ip)
	if err != nil {
		revel.ERROR.Print(err)
	}

	//revel.INFO.Printf("Record: %v", record)

	return record
}
