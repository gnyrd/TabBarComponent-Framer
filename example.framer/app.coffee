TabBarComponent = require "TabBarComponent"

#########################################

matDesLightBlue = new Color("#00BCD4")
matDesWhite = new Color("#FAFAFA")
matDesYellow = new Color("#FCEB56")

header.point = {x: 0, y: 0}
header.width = Screen.width

tb = new TabBarComponent
	y: header.maxY-1 # removes an annoying.5px border
	tabs: [Recent, Favorite, Nearby]
	active: 0
	tabBarColor: matDesLightBlue
	iconColor: matDesWhite
	indicatorColor: matDesYellow
tb.placeBehind(header)
tb.activateTab(0)

page = new Layer
	height: Screen.height * 1.5
	width: Screen.width
	backgroundColor: matDesLightBlue.alpha(Utils.randomNumber(.2, .4))
page.label = "calls"
recentFlow = tb.tabs[0]
recentFlow.flow.showNext(page)
recentFlow.flow.scroll.scrollHorizontal = false

page2 = new Layer
	height: Screen.height * 1.5
	width: Screen.width
	backgroundColor: matDesLightBlue.alpha(Utils.randomNumber(.4, .6))
page2.label = "favs"
favsFlow = tb.tabs[1]
favsFlow.flow.showNext(page2)
favsFlow.flow.scroll.scrollHorizontal = false

page3 = new Layer
	height: Screen.height * 1.5
	width: Screen.width
	backgroundColor: matDesLightBlue.alpha(Utils.randomNumber(.6, .8))
page3.label = "contacts"
nearbyFlow = tb.tabs[2]
nearbyFlow.flow.showNext(page3)
nearbyFlow.flow.scroll.scrollHorizontal = false

