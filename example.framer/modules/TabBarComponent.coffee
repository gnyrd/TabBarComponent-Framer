###
# intended API
TabBarComponent
	platform: android | ios
	position: bottom | top | custom?
	backgroundColor:
	tabs: [<layer *design target>, ...]
	iconColor:
	tabLabel: true | false
	labelColor:
	indicator: true | false
	indicatorColor:
	hideOnScroll: true | false
###


# Setup
defaults =
	tabBarPosition: "top" # ("top" || "bottom")
	tabBarY: Align.top
	tabBarHide: true
	tabs: []
	active: 0
	iconColor: "black"
	labelColor: "black"
	tabBarColor: "white"
	tabLabel: false
	activeIndicator: true
	indicatorColor: "black"

class TabBarComponent extends Layer
	constructor: (@options={}) ->
		@options = _.assign({}, defaults, @options)
		super @options

		@layout = () =>
			for layer in @children
				layer.destroy()

			@width = Screen.width
			@height = 48
			@backgroundColor = "clear"

			tabContent = new FlowComponent
				name: "TabContents"
				parent: @
				y: 0

			tabBarComponent = new Layer
				name: "TabBarComponent"
				parent: @
				y: @options.tabBarY ## position: bottom | top | custom?
				x: 0
				height: 48
				width: Screen.width

			tabWidth = Screen.width / @options.tabs.length

			tabBar = new Layer
				name: "TabBar"
				parent: tabBarComponent
				x: 0
				y: 0
				height: 48 # # per platform
				width: Screen.width
				backgroundColor: @options.tabBarColor

			tabBar.states =
				show:
					y: 0
					animationOptions:
						curve: "spring(400, 40, 0)"
						time: 0.01
				hide:
					y: tabBar.y - tabBar.height
					animationOptions:
						curve: "spring(400, 40, 0)"
						time: 0.05

			# activeIndicator
			activeIndicator = new Layer
				name: "TabIndicator"
				parent: tabBar
				x: tabWidth * @options.active
				y: Align.bottom
				height: 2
				width: tabWidth
				backgroundColor: @options.indicatorColor
			if @options.activeIndicator is false
				tabInd.visible = false

			moveactiveIndicator = (pos, dur) ->
				activeIndicator.animate
					properties:
						x: pos
					time: dur
					curve: Bezier.easeInOut

			# tabs
			tempTabs = []
			@options.tabs.forEach (item, i) =>
				tab = new Layer
					parent: tabBar
					name: item.name.toLowerCase() + "Tab"
					x: i * tabWidth
					y: 0
					height: 48
					width: tabWidth
					backgroundColor: ""
				tab.states =
					active:
						opacity: 1.0
						grayscale: 0
					inactive:
						opacity: 0.5
						grayscale: 100
				tab.stateSwitch("inactive")
				tab.addChild(item)
				item.x = Align.center
				item.children[0].color = @options.iconColor

				if @options.tabLabel
					label = new TextLayer
						name: item.name.toLowerCase() + "Label"
						parent: tab
						x: Align.center
						y: Align.bottom
						text: item.name
						textAlign: "center"
						fontSize: 10
						color: @options.labelColor

				section = new FlowComponent
					name: item.name.toLowerCase() + "Contents"
					parent: tabContent
					x: tabContent.width * i
					y: 0
					size: tabContent.size

				if @options.tabBarHide
					section.onScrollStart ->
						if event.offsetDirection == "up"
							tabBar.animate("hide")
						else
							tabBar.animate("show")

				tempTabs.push({tab: tab, contents: section})

				tab.onClick =>
					@options.active = i
					@activateTab(i)

			@options.tabs = tempTabs

			@activateTab = (pos) ->
				@options.tabs[pos].tab.siblings.forEach (item) ->
					if item isnt activeIndicator
						item.stateSwitch("inactive")
				@options.tabs[pos].tab.stateSwitch("active")
				moveactiveIndicator(tabWidth * pos, 0.2)
				contentsMap = @options.tabs.map (section) -> section.contents
				j = contentsMap.indexOf(tabContent.current)
				if @options.active < j
					transition = slideInLeft
				else
					transition = slideInRight
				tabContent.transition(@options.tabs[pos].contents, transition)
				moveactiveIndicator(tabWidth * pos, 0.2)
		# end @layout()

		@layout()

		@activateTab(@options.active)

	@define 'tabs',
		get: ->
			@options.tabs
		set: (value) ->
			@options.tabs = value


		# Tab Bar Transitions
		slideInRight = (nav, layerA, layerB, overlay) ->
			transition =
				layerA:
					show:
						x: 0, y: 0
						options:
							curve: Bezier.easeInOut
							time: .3
					hide:
						x: -nav.width, y: 0
						options:
							curve: Bezier.easeInOut
							time: .3
				layerB:
					show:
						x: 0, y: 0
						options:
							curve: Bezier.easeInOut
							time: .3
					hide:
						x: nav.width, y: 0
						options:
							curve: Bezier.easeInOut
							time: .3
		slideInLeft = (nav, layerA, layerB, overlay) ->
			transition =
				layerA:
					show:
						x: 0, y: 0
						options:
							curve: Bezier.easeInOut
							time: .3
					hide:
						x: nav.width, y: 0
						options:
							curve: Bezier.easeInOut
							time: .3
				layerB:
					show:
						x: 0, y: 0
						options:
							curve: Bezier.easeInOut
							time: .3
					hide:
						x: -nav.width, y: 0
						options:
							curve: Bezier.easeInOut
							time: .3
module.exports = TabBarComponent
