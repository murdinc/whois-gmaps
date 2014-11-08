package controllers

import (
	"net"
	"github.com/robfig/revel"
	"github.com/oschwald/geoip2-golang"
)

type Whois struct {
	*revel.Controller
}

type whoisResults struct {
	Latitude	float64
	Longitude	float64
	IsoCode		string
	IP			net.IP
	Request		string
	Forwarded	string
}

func (c Whois) Index() revel.Result {

	// If this is a POST we want to return JSON info
	if c.Params.Get("METHOD") == "POST" {
		ip :=  net.ParseIP(c.Params.Get("ip"))
		//revel.INFO.Printf("Looking up IP address: %s %v", ip, c.Params)
		return c.RenderJson( c.getInfo(ip) )
	}

	// If this is a GET we want to set up our maps key
	// Pull in our google maps api URL with key from app.conf
	mapsApiKey, _ := revel.Config.String("app.mapsapikey")
	return c.Render(mapsApiKey)

}

func (c Whois) getInfo(ip net.IP) whoisResults {

	var results whoisResults

	db, err := geoip2.Open("geoip/GeoLite2-City.mmdb")
	if err != nil {
		revel.ERROR.Print(err)
	}

	defer db.Close()
	record, err := db.City(ip)
	if err != nil {
		revel.ERROR.Print(err)
	}

	results.Latitude = record.Location.Latitude
	results.Longitude = record.Location.Longitude
	results.IsoCode = record.Country.IsoCode
	results.IP = ip
	results.Request = c.Request.RemoteAddr
	results.Forwarded = c.Request.Header.Get("X-FORWARDED-FOR")

	revel.INFO.Printf("Result: %v", results)

	return results
}
