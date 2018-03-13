require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"TabBarComponent":[function(require,module,exports){

/*
 * intended API
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
 */
var TabBarComponent, defaults,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

defaults = {
  tabBarPosition: "top",
  tabBarY: Align.top,
  tabBarHide: true,
  tabs: [],
  active: 0,
  iconColor: "black",
  labelColor: "black",
  tabBarColor: "white",
  tabLabel: false,
  activeIndicator: true,
  indicatorColor: "black"
};

TabBarComponent = (function(superClass) {
  var slideInLeft, slideInRight;

  extend(TabBarComponent, superClass);

  function TabBarComponent(options) {
    this.options = options != null ? options : {};
    this.options = _.assign({}, defaults, this.options);
    TabBarComponent.__super__.constructor.call(this, this.options);
    this.layout = (function(_this) {
      return function() {
        var activeIndicator, k, layer, len, moveactiveIndicator, ref, tabBar, tabBarComponent, tabContent, tabWidth, tempTabs;
        ref = _this.children;
        for (k = 0, len = ref.length; k < len; k++) {
          layer = ref[k];
          layer.destroy();
        }
        _this.width = Screen.width;
        _this.height = 48;
        _this.backgroundColor = "clear";
        tabContent = new FlowComponent({
          name: "TabContents",
          parent: _this,
          y: 0
        });
        tabBarComponent = new Layer({
          name: "TabBarComponent",
          parent: _this,
          y: _this.options.tabBarY,
          x: 0,
          height: 48,
          width: Screen.width
        });
        tabWidth = Screen.width / _this.options.tabs.length;
        tabBar = new Layer({
          name: "TabBar",
          parent: tabBarComponent,
          x: 0,
          y: 0,
          height: 48,
          width: Screen.width,
          backgroundColor: _this.options.tabBarColor
        });
        tabBar.states = {
          show: {
            y: 0,
            animationOptions: {
              curve: "spring(400, 40, 0)",
              time: 0.01
            }
          },
          hide: {
            y: tabBar.y - tabBar.height,
            animationOptions: {
              curve: "spring(400, 40, 0)",
              time: 0.05
            }
          }
        };
        activeIndicator = new Layer({
          name: "TabIndicator",
          parent: tabBar,
          x: tabWidth * _this.options.active,
          y: Align.bottom,
          height: 2,
          width: tabWidth,
          backgroundColor: _this.options.indicatorColor
        });
        if (_this.options.activeIndicator === false) {
          tabInd.visible = false;
        }
        moveactiveIndicator = function(pos, dur) {
          return activeIndicator.animate({
            properties: {
              x: pos
            },
            time: dur,
            curve: Bezier.easeInOut
          });
        };
        tempTabs = [];
        _this.options.tabs.forEach(function(item, i) {
          var label, section, tab;
          tab = new Layer({
            parent: tabBar,
            name: item.name.toLowerCase() + "Tab",
            x: i * tabWidth,
            y: 0,
            height: 48,
            width: tabWidth,
            backgroundColor: ""
          });
          tab.states = {
            active: {
              opacity: 1.0,
              grayscale: 0
            },
            inactive: {
              opacity: 0.5,
              grayscale: 100
            }
          };
          tab.stateSwitch("inactive");
          tab.addChild(item);
          item.x = Align.center;
          item.children[0].color = _this.options.iconColor;
          if (_this.options.tabLabel) {
            label = new TextLayer({
              name: item.name.toLowerCase() + "Label",
              parent: tab,
              x: Align.center,
              y: Align.bottom,
              text: item.name,
              textAlign: "center",
              fontSize: 10,
              color: _this.options.labelColor
            });
          }
          section = new FlowComponent({
            name: item.name.toLowerCase() + "Contents",
            parent: tabContent,
            x: tabContent.width * i,
            y: 0,
            size: tabContent.size
          });
          if (_this.options.tabBarHide) {
            section.onScrollStart(function() {
              if (event.offsetDirection === "up") {
                return tabBar.animate("hide");
              } else {
                return tabBar.animate("show");
              }
            });
          }
          tempTabs.push({
            tab: tab,
            contents: section
          });
          return tab.onClick(function() {
            _this.options.active = i;
            return _this.activateTab(i);
          });
        });
        _this.options.tabs = tempTabs;
        return _this.activateTab = function(pos) {
          var contentsMap, j, transition;
          this.options.tabs[pos].tab.siblings.forEach(function(item) {
            if (item !== activeIndicator) {
              return item.stateSwitch("inactive");
            }
          });
          this.options.tabs[pos].tab.stateSwitch("active");
          moveactiveIndicator(tabWidth * pos, 0.2);
          contentsMap = this.options.tabs.map(function(section) {
            return section.contents;
          });
          j = contentsMap.indexOf(tabContent.current);
          if (this.options.active < j) {
            transition = slideInLeft;
          } else {
            transition = slideInRight;
          }
          tabContent.transition(this.options.tabs[pos].contents, transition);
          return moveactiveIndicator(tabWidth * pos, 0.2);
        };
      };
    })(this);
    this.layout();
    this.activateTab(this.options.active);
  }

  TabBarComponent.define('tabs', {
    get: function() {
      return this.options.tabs;
    },
    set: function(value) {
      return this.options.tabs = value;
    }
  }, slideInRight = function(nav, layerA, layerB, overlay) {
    var transition;
    return transition = {
      layerA: {
        show: {
          x: 0,
          y: 0,
          options: {
            curve: Bezier.easeInOut,
            time: .3
          }
        },
        hide: {
          x: -nav.width,
          y: 0,
          options: {
            curve: Bezier.easeInOut,
            time: .3
          }
        }
      },
      layerB: {
        show: {
          x: 0,
          y: 0,
          options: {
            curve: Bezier.easeInOut,
            time: .3
          }
        },
        hide: {
          x: nav.width,
          y: 0,
          options: {
            curve: Bezier.easeInOut,
            time: .3
          }
        }
      }
    };
  }, slideInLeft = function(nav, layerA, layerB, overlay) {
    var transition;
    return transition = {
      layerA: {
        show: {
          x: 0,
          y: 0,
          options: {
            curve: Bezier.easeInOut,
            time: .3
          }
        },
        hide: {
          x: nav.width,
          y: 0,
          options: {
            curve: Bezier.easeInOut,
            time: .3
          }
        }
      },
      layerB: {
        show: {
          x: 0,
          y: 0,
          options: {
            curve: Bezier.easeInOut,
            time: .3
          }
        },
        hide: {
          x: -nav.width,
          y: 0,
          options: {
            curve: Bezier.easeInOut,
            time: .3
          }
        }
      }
    };
  });

  return TabBarComponent;

})(Layer);

module.exports = TabBarComponent;


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vbW9kdWxlcy9UYWJCYXJDb21wb25lbnQuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIiwiIyMjXG4jIGludGVuZGVkIEFQSVxuVGFiQmFyQ29tcG9uZW50XG5cdHBsYXRmb3JtOiBhbmRyb2lkIHwgaW9zXG5cdHBvc2l0aW9uOiBib3R0b20gfCB0b3AgfCBjdXN0b20/XG5cdGJhY2tncm91bmRDb2xvcjpcblx0dGFiczogWzxsYXllciAqZGVzaWduIHRhcmdldD4sIC4uLl1cblx0aWNvbkNvbG9yOlxuXHR0YWJMYWJlbDogdHJ1ZSB8IGZhbHNlXG5cdGxhYmVsQ29sb3I6XG5cdGluZGljYXRvcjogdHJ1ZSB8IGZhbHNlXG5cdGluZGljYXRvckNvbG9yOlxuXHRoaWRlT25TY3JvbGw6IHRydWUgfCBmYWxzZVxuIyMjXG5cblxuIyBTZXR1cFxuZGVmYXVsdHMgPVxuXHR0YWJCYXJQb3NpdGlvbjogXCJ0b3BcIiAjIChcInRvcFwiIHx8IFwiYm90dG9tXCIpXG5cdHRhYkJhclk6IEFsaWduLnRvcFxuXHR0YWJCYXJIaWRlOiB0cnVlXG5cdHRhYnM6IFtdXG5cdGFjdGl2ZTogMFxuXHRpY29uQ29sb3I6IFwiYmxhY2tcIlxuXHRsYWJlbENvbG9yOiBcImJsYWNrXCJcblx0dGFiQmFyQ29sb3I6IFwid2hpdGVcIlxuXHR0YWJMYWJlbDogZmFsc2Vcblx0YWN0aXZlSW5kaWNhdG9yOiB0cnVlXG5cdGluZGljYXRvckNvbG9yOiBcImJsYWNrXCJcblxuY2xhc3MgVGFiQmFyQ29tcG9uZW50IGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblx0XHRAb3B0aW9ucyA9IF8uYXNzaWduKHt9LCBkZWZhdWx0cywgQG9wdGlvbnMpXG5cdFx0c3VwZXIgQG9wdGlvbnNcblxuXHRcdEBsYXlvdXQgPSAoKSA9PlxuXHRcdFx0Zm9yIGxheWVyIGluIEBjaGlsZHJlblxuXHRcdFx0XHRsYXllci5kZXN0cm95KClcblxuXHRcdFx0QHdpZHRoID0gU2NyZWVuLndpZHRoXG5cdFx0XHRAaGVpZ2h0ID0gNDhcblx0XHRcdEBiYWNrZ3JvdW5kQ29sb3IgPSBcImNsZWFyXCJcblxuXHRcdFx0dGFiQ29udGVudCA9IG5ldyBGbG93Q29tcG9uZW50XG5cdFx0XHRcdG5hbWU6IFwiVGFiQ29udGVudHNcIlxuXHRcdFx0XHRwYXJlbnQ6IEBcblx0XHRcdFx0eTogMFxuXG5cdFx0XHR0YWJCYXJDb21wb25lbnQgPSBuZXcgTGF5ZXJcblx0XHRcdFx0bmFtZTogXCJUYWJCYXJDb21wb25lbnRcIlxuXHRcdFx0XHRwYXJlbnQ6IEBcblx0XHRcdFx0eTogQG9wdGlvbnMudGFiQmFyWSAjIyBwb3NpdGlvbjogYm90dG9tIHwgdG9wIHwgY3VzdG9tP1xuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdGhlaWdodDogNDhcblx0XHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXG5cdFx0XHR0YWJXaWR0aCA9IFNjcmVlbi53aWR0aCAvIEBvcHRpb25zLnRhYnMubGVuZ3RoXG5cblx0XHRcdHRhYkJhciA9IG5ldyBMYXllclxuXHRcdFx0XHRuYW1lOiBcIlRhYkJhclwiXG5cdFx0XHRcdHBhcmVudDogdGFiQmFyQ29tcG9uZW50XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XHRoZWlnaHQ6IDQ4ICMgIyBwZXIgcGxhdGZvcm1cblx0XHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IEBvcHRpb25zLnRhYkJhckNvbG9yXG5cblx0XHRcdHRhYkJhci5zdGF0ZXMgPVxuXHRcdFx0XHRzaG93OlxuXHRcdFx0XHRcdHk6IDBcblx0XHRcdFx0XHRhbmltYXRpb25PcHRpb25zOlxuXHRcdFx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDQwMCwgNDAsIDApXCJcblx0XHRcdFx0XHRcdHRpbWU6IDAuMDFcblx0XHRcdFx0aGlkZTpcblx0XHRcdFx0XHR5OiB0YWJCYXIueSAtIHRhYkJhci5oZWlnaHRcblx0XHRcdFx0XHRhbmltYXRpb25PcHRpb25zOlxuXHRcdFx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDQwMCwgNDAsIDApXCJcblx0XHRcdFx0XHRcdHRpbWU6IDAuMDVcblxuXHRcdFx0IyBhY3RpdmVJbmRpY2F0b3Jcblx0XHRcdGFjdGl2ZUluZGljYXRvciA9IG5ldyBMYXllclxuXHRcdFx0XHRuYW1lOiBcIlRhYkluZGljYXRvclwiXG5cdFx0XHRcdHBhcmVudDogdGFiQmFyXG5cdFx0XHRcdHg6IHRhYldpZHRoICogQG9wdGlvbnMuYWN0aXZlXG5cdFx0XHRcdHk6IEFsaWduLmJvdHRvbVxuXHRcdFx0XHRoZWlnaHQ6IDJcblx0XHRcdFx0d2lkdGg6IHRhYldpZHRoXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQG9wdGlvbnMuaW5kaWNhdG9yQ29sb3Jcblx0XHRcdGlmIEBvcHRpb25zLmFjdGl2ZUluZGljYXRvciBpcyBmYWxzZVxuXHRcdFx0XHR0YWJJbmQudmlzaWJsZSA9IGZhbHNlXG5cblx0XHRcdG1vdmVhY3RpdmVJbmRpY2F0b3IgPSAocG9zLCBkdXIpIC0+XG5cdFx0XHRcdGFjdGl2ZUluZGljYXRvci5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdHg6IHBvc1xuXHRcdFx0XHRcdHRpbWU6IGR1clxuXHRcdFx0XHRcdGN1cnZlOiBCZXppZXIuZWFzZUluT3V0XG5cblx0XHRcdCMgdGFic1xuXHRcdFx0dGVtcFRhYnMgPSBbXVxuXHRcdFx0QG9wdGlvbnMudGFicy5mb3JFYWNoIChpdGVtLCBpKSA9PlxuXHRcdFx0XHR0YWIgPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRwYXJlbnQ6IHRhYkJhclxuXHRcdFx0XHRcdG5hbWU6IGl0ZW0ubmFtZS50b0xvd2VyQ2FzZSgpICsgXCJUYWJcIlxuXHRcdFx0XHRcdHg6IGkgKiB0YWJXaWR0aFxuXHRcdFx0XHRcdHk6IDBcblx0XHRcdFx0XHRoZWlnaHQ6IDQ4XG5cdFx0XHRcdFx0d2lkdGg6IHRhYldpZHRoXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdFx0XHRcdHRhYi5zdGF0ZXMgPVxuXHRcdFx0XHRcdGFjdGl2ZTpcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDEuMFxuXHRcdFx0XHRcdFx0Z3JheXNjYWxlOiAwXG5cdFx0XHRcdFx0aW5hY3RpdmU6XG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAwLjVcblx0XHRcdFx0XHRcdGdyYXlzY2FsZTogMTAwXG5cdFx0XHRcdHRhYi5zdGF0ZVN3aXRjaChcImluYWN0aXZlXCIpXG5cdFx0XHRcdHRhYi5hZGRDaGlsZChpdGVtKVxuXHRcdFx0XHRpdGVtLnggPSBBbGlnbi5jZW50ZXJcblx0XHRcdFx0aXRlbS5jaGlsZHJlblswXS5jb2xvciA9IEBvcHRpb25zLmljb25Db2xvclxuXG5cdFx0XHRcdGlmIEBvcHRpb25zLnRhYkxhYmVsXG5cdFx0XHRcdFx0bGFiZWwgPSBuZXcgVGV4dExheWVyXG5cdFx0XHRcdFx0XHRuYW1lOiBpdGVtLm5hbWUudG9Mb3dlckNhc2UoKSArIFwiTGFiZWxcIlxuXHRcdFx0XHRcdFx0cGFyZW50OiB0YWJcblx0XHRcdFx0XHRcdHg6IEFsaWduLmNlbnRlclxuXHRcdFx0XHRcdFx0eTogQWxpZ24uYm90dG9tXG5cdFx0XHRcdFx0XHR0ZXh0OiBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIlxuXHRcdFx0XHRcdFx0Zm9udFNpemU6IDEwXG5cdFx0XHRcdFx0XHRjb2xvcjogQG9wdGlvbnMubGFiZWxDb2xvclxuXG5cdFx0XHRcdHNlY3Rpb24gPSBuZXcgRmxvd0NvbXBvbmVudFxuXHRcdFx0XHRcdG5hbWU6IGl0ZW0ubmFtZS50b0xvd2VyQ2FzZSgpICsgXCJDb250ZW50c1wiXG5cdFx0XHRcdFx0cGFyZW50OiB0YWJDb250ZW50XG5cdFx0XHRcdFx0eDogdGFiQ29udGVudC53aWR0aCAqIGlcblx0XHRcdFx0XHR5OiAwXG5cdFx0XHRcdFx0c2l6ZTogdGFiQ29udGVudC5zaXplXG5cblx0XHRcdFx0aWYgQG9wdGlvbnMudGFiQmFySGlkZVxuXHRcdFx0XHRcdHNlY3Rpb24ub25TY3JvbGxTdGFydCAtPlxuXHRcdFx0XHRcdFx0aWYgZXZlbnQub2Zmc2V0RGlyZWN0aW9uID09IFwidXBcIlxuXHRcdFx0XHRcdFx0XHR0YWJCYXIuYW5pbWF0ZShcImhpZGVcIilcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0dGFiQmFyLmFuaW1hdGUoXCJzaG93XCIpXG5cblx0XHRcdFx0dGVtcFRhYnMucHVzaCh7dGFiOiB0YWIsIGNvbnRlbnRzOiBzZWN0aW9ufSlcblxuXHRcdFx0XHR0YWIub25DbGljayA9PlxuXHRcdFx0XHRcdEBvcHRpb25zLmFjdGl2ZSA9IGlcblx0XHRcdFx0XHRAYWN0aXZhdGVUYWIoaSlcblxuXHRcdFx0QG9wdGlvbnMudGFicyA9IHRlbXBUYWJzXG5cblx0XHRcdEBhY3RpdmF0ZVRhYiA9IChwb3MpIC0+XG5cdFx0XHRcdEBvcHRpb25zLnRhYnNbcG9zXS50YWIuc2libGluZ3MuZm9yRWFjaCAoaXRlbSkgLT5cblx0XHRcdFx0XHRpZiBpdGVtIGlzbnQgYWN0aXZlSW5kaWNhdG9yXG5cdFx0XHRcdFx0XHRpdGVtLnN0YXRlU3dpdGNoKFwiaW5hY3RpdmVcIilcblx0XHRcdFx0QG9wdGlvbnMudGFic1twb3NdLnRhYi5zdGF0ZVN3aXRjaChcImFjdGl2ZVwiKVxuXHRcdFx0XHRtb3ZlYWN0aXZlSW5kaWNhdG9yKHRhYldpZHRoICogcG9zLCAwLjIpXG5cdFx0XHRcdGNvbnRlbnRzTWFwID0gQG9wdGlvbnMudGFicy5tYXAgKHNlY3Rpb24pIC0+IHNlY3Rpb24uY29udGVudHNcblx0XHRcdFx0aiA9IGNvbnRlbnRzTWFwLmluZGV4T2YodGFiQ29udGVudC5jdXJyZW50KVxuXHRcdFx0XHRpZiBAb3B0aW9ucy5hY3RpdmUgPCBqXG5cdFx0XHRcdFx0dHJhbnNpdGlvbiA9IHNsaWRlSW5MZWZ0XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0cmFuc2l0aW9uID0gc2xpZGVJblJpZ2h0XG5cdFx0XHRcdHRhYkNvbnRlbnQudHJhbnNpdGlvbihAb3B0aW9ucy50YWJzW3Bvc10uY29udGVudHMsIHRyYW5zaXRpb24pXG5cdFx0XHRcdG1vdmVhY3RpdmVJbmRpY2F0b3IodGFiV2lkdGggKiBwb3MsIDAuMilcblx0XHQjIGVuZCBAbGF5b3V0KClcblxuXHRcdEBsYXlvdXQoKVxuXG5cdFx0QGFjdGl2YXRlVGFiKEBvcHRpb25zLmFjdGl2ZSlcblxuXHRAZGVmaW5lICd0YWJzJyxcblx0XHRnZXQ6IC0+XG5cdFx0XHRAb3B0aW9ucy50YWJzXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAb3B0aW9ucy50YWJzID0gdmFsdWVcblxuXG5cdFx0IyBUYWIgQmFyIFRyYW5zaXRpb25zXG5cdFx0c2xpZGVJblJpZ2h0ID0gKG5hdiwgbGF5ZXJBLCBsYXllckIsIG92ZXJsYXkpIC0+XG5cdFx0XHR0cmFuc2l0aW9uID1cblx0XHRcdFx0bGF5ZXJBOlxuXHRcdFx0XHRcdHNob3c6XG5cdFx0XHRcdFx0XHR4OiAwLCB5OiAwXG5cdFx0XHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRjdXJ2ZTogQmV6aWVyLmVhc2VJbk91dFxuXHRcdFx0XHRcdFx0XHR0aW1lOiAuM1xuXHRcdFx0XHRcdGhpZGU6XG5cdFx0XHRcdFx0XHR4OiAtbmF2LndpZHRoLCB5OiAwXG5cdFx0XHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRjdXJ2ZTogQmV6aWVyLmVhc2VJbk91dFxuXHRcdFx0XHRcdFx0XHR0aW1lOiAuM1xuXHRcdFx0XHRsYXllckI6XG5cdFx0XHRcdFx0c2hvdzpcblx0XHRcdFx0XHRcdHg6IDAsIHk6IDBcblx0XHRcdFx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdGN1cnZlOiBCZXppZXIuZWFzZUluT3V0XG5cdFx0XHRcdFx0XHRcdHRpbWU6IC4zXG5cdFx0XHRcdFx0aGlkZTpcblx0XHRcdFx0XHRcdHg6IG5hdi53aWR0aCwgeTogMFxuXHRcdFx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHRcdFx0Y3VydmU6IEJlemllci5lYXNlSW5PdXRcblx0XHRcdFx0XHRcdFx0dGltZTogLjNcblx0XHRzbGlkZUluTGVmdCA9IChuYXYsIGxheWVyQSwgbGF5ZXJCLCBvdmVybGF5KSAtPlxuXHRcdFx0dHJhbnNpdGlvbiA9XG5cdFx0XHRcdGxheWVyQTpcblx0XHRcdFx0XHRzaG93OlxuXHRcdFx0XHRcdFx0eDogMCwgeTogMFxuXHRcdFx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHRcdFx0Y3VydmU6IEJlemllci5lYXNlSW5PdXRcblx0XHRcdFx0XHRcdFx0dGltZTogLjNcblx0XHRcdFx0XHRoaWRlOlxuXHRcdFx0XHRcdFx0eDogbmF2LndpZHRoLCB5OiAwXG5cdFx0XHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRjdXJ2ZTogQmV6aWVyLmVhc2VJbk91dFxuXHRcdFx0XHRcdFx0XHR0aW1lOiAuM1xuXHRcdFx0XHRsYXllckI6XG5cdFx0XHRcdFx0c2hvdzpcblx0XHRcdFx0XHRcdHg6IDAsIHk6IDBcblx0XHRcdFx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdGN1cnZlOiBCZXppZXIuZWFzZUluT3V0XG5cdFx0XHRcdFx0XHRcdHRpbWU6IC4zXG5cdFx0XHRcdFx0aGlkZTpcblx0XHRcdFx0XHRcdHg6IC1uYXYud2lkdGgsIHk6IDBcblx0XHRcdFx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdGN1cnZlOiBCZXppZXIuZWFzZUluT3V0XG5cdFx0XHRcdFx0XHRcdHRpbWU6IC4zXG5tb2R1bGUuZXhwb3J0cyA9IFRhYkJhckNvbXBvbmVudFxuIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFFQUE7O0FEQUE7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQSx5QkFBQTtFQUFBOzs7QUFpQkEsUUFBQSxHQUNDO0VBQUEsY0FBQSxFQUFnQixLQUFoQjtFQUNBLE9BQUEsRUFBUyxLQUFLLENBQUMsR0FEZjtFQUVBLFVBQUEsRUFBWSxJQUZaO0VBR0EsSUFBQSxFQUFNLEVBSE47RUFJQSxNQUFBLEVBQVEsQ0FKUjtFQUtBLFNBQUEsRUFBVyxPQUxYO0VBTUEs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
