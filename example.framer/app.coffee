TabBarComponent = require "TabBarComponent"

#########################################

tb = new TabBarComponent
	y: 128
	tabs: [Home, Photos, Store]
	active: 0
	tabLabel: true
	labelColor: "black"

tb.activateTab(0)

tb.tabs[0].contents.showNext(pageA)
tb.tabs[1].contents.showNext(pageB)
tb.tabs[2].contents.showNext(pageD)



# other transitions
crossFade = (nav, LayerA, LayerB, overlay) ->
	layerA:
		show:
			x:0, y: 0
			opacity: 1

		hide:
			x:0, y: 0
			opacity: 0
	layerB:
		show:
			x:0, y: 0
			opacity: 1
		hide:
			x:0, y: 0
			opacity: 0
slideOverRight = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show:
				x: 0
				y: 0
				options:
					curve: Bezier.easeInOut
					time: .3
			hide:
				x: nav.width
				y: 0
				options:
					curve: Bezier.easeInOut
					time: .3

slideOverLeft = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show:
				x: 0
				y: 0
				
				options:
					curve: Bezier.easeInOut
					time: .3
			hide:
				x: -nav.width
				y: 0
				options:
					curve: Bezier.easeInOut
					time: .3
