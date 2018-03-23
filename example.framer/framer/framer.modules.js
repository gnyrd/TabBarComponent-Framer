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
  iconColor: "#00BCD4",
  labelColor: null,
  tabBarColor: "#FAFAFA",
  tabLabel: false,
  activeIndicator: true,
  indicatorColor: null
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
        var activeIndicator, base, k, layer, len, moveactiveIndicator, ref, tabBar, tabBarComponent, tabContent, tabWidth, tempTabs;
        ref = _this.children;
        for (k = 0, len = ref.length; k < len; k++) {
          layer = ref[k];
          layer.destroy();
        }
        _this.width = Screen.width;
        _this.height = 48;
        _this.backgroundColor = null;
        tabContent = new FlowComponent({
          name: "TabBarContents",
          parent: _this,
          y: 0,
          backgroundColor: null
        });
        tabBarComponent = new Layer({
          name: "TabBarComponent",
          parent: _this,
          y: _this.options.tabBarY,
          x: 0,
          height: 48,
          width: Screen.width,
          backgroundColor: null
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
            y: tabBar.y - (tabBar.height * 2),
            animationOptions: {
              curve: "spring(400, 40, 0)",
              time: 0.05
            }
          }
        };
        if ((base = _this.options).indicatorColor == null) {
          base.indicatorColor = _this.options.iconColor;
        }
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
          var base1, label, section, tab;
          tab = new Layer({
            parent: tabBar,
            name: item.name.toLowerCase() + "Tab",
            x: i * tabWidth,
            y: 0,
            height: 48,
            width: tabWidth,
            backgroundColor: ""
          });
          tab.addChild(item);
          item.x = Align.center;
          item.children[0].color = _this.options.iconColor;
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
          if (_this.options.tabLabel) {
            if ((base1 = _this.options).labelColor == null) {
              base1.labelColor = _this.options.iconColor;
            }
            label = new TextLayer({
              name: item.name.toLowerCase() + "Label",
              parent: tab,
              x: Align.center,
              y: Align.bottom,
              text: item.name.toUpperCase(),
              textAlign: "center",
              fontSize: 14,
              fontFamily: "Roboto",
              color: _this.options.labelColor
            });
          }
          section = new FlowComponent({
            name: item.name.toLowerCase() + "Flow",
            parent: tabContent,
            x: tabContent.width * i,
            y: 0,
            size: tabContent.size,
            backgroundColor: null
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
            flow: section
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
            return section.flow;
          });
          j = contentsMap.indexOf(tabContent.current);
          if (this.options.active < j) {
            transition = slideInLeft;
          } else {
            transition = slideInRight;
          }
          tabContent.transition(this.options.tabs[pos].flow, transition);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2dhbnlhcmQvUmVwb3MvVGFiQmFyQ29tcG9uZW50LUZyYW1lci9leGFtcGxlLmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2dhbnlhcmQvUmVwb3MvVGFiQmFyQ29tcG9uZW50LUZyYW1lci9leGFtcGxlLmZyYW1lci9tb2R1bGVzL1RhYkJhckNvbXBvbmVudC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCIjIyNcbiMgaW50ZW5kZWQgQVBJXG5UYWJCYXJDb21wb25lbnRcblx0cGxhdGZvcm06IGFuZHJvaWQgfCBpb3Ncblx0cG9zaXRpb246IGJvdHRvbSB8IHRvcCB8IGN1c3RvbT9cblx0YmFja2dyb3VuZENvbG9yOlxuXHR0YWJzOiBbPGxheWVyICpkZXNpZ24gdGFyZ2V0PiwgLi4uXVxuXHRpY29uQ29sb3I6XG5cdHRhYkxhYmVsOiB0cnVlIHwgZmFsc2Vcblx0bGFiZWxDb2xvcjpcblx0aW5kaWNhdG9yOiB0cnVlIHwgZmFsc2Vcblx0aW5kaWNhdG9yQ29sb3I6XG5cdGhpZGVPblNjcm9sbDogdHJ1ZSB8IGZhbHNlXG4jIyNcblxuXG4jIFNldHVwXG5kZWZhdWx0cyA9XG5cdHRhYkJhclBvc2l0aW9uOiBcInRvcFwiICMgKFwidG9wXCIgfHwgXCJib3R0b21cIilcblx0dGFiQmFyWTogQWxpZ24udG9wXG5cdHRhYkJhckhpZGU6IHRydWVcblx0dGFiczogW11cblx0YWN0aXZlOiAwXG5cdGljb25Db2xvcjogXCIjMDBCQ0Q0XCJcblx0bGFiZWxDb2xvcjogbnVsbFxuXHR0YWJCYXJDb2xvcjogXCIjRkFGQUZBXCJcblx0dGFiTGFiZWw6IGZhbHNlXG5cdGFjdGl2ZUluZGljYXRvcjogdHJ1ZVxuXHRpbmRpY2F0b3JDb2xvcjogbnVsbFxuXG5jbGFzcyBUYWJCYXJDb21wb25lbnQgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zPXt9KSAtPlxuXHRcdEBvcHRpb25zID0gXy5hc3NpZ24oe30sIGRlZmF1bHRzLCBAb3B0aW9ucylcblx0XHRzdXBlciBAb3B0aW9uc1xuXG5cdFx0QGxheW91dCA9ICgpID0+XG5cdFx0XHRmb3IgbGF5ZXIgaW4gQGNoaWxkcmVuXG5cdFx0XHRcdGxheWVyLmRlc3Ryb3koKVxuXG5cdFx0XHRAd2lkdGggPSBTY3JlZW4ud2lkdGhcblx0XHRcdEBoZWlnaHQgPSA0OFxuXHRcdFx0QGJhY2tncm91bmRDb2xvciA9IG51bGxcblxuXHRcdFx0dGFiQ29udGVudCA9IG5ldyBGbG93Q29tcG9uZW50XG5cdFx0XHRcdG5hbWU6IFwiVGFiQmFyQ29udGVudHNcIlxuXHRcdFx0XHRwYXJlbnQ6IEBcblx0XHRcdFx0eTogMFxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblxuXHRcdFx0dGFiQmFyQ29tcG9uZW50ID0gbmV3IExheWVyXG5cdFx0XHRcdG5hbWU6IFwiVGFiQmFyQ29tcG9uZW50XCJcblx0XHRcdFx0cGFyZW50OiBAXG5cdFx0XHRcdHk6IEBvcHRpb25zLnRhYkJhclkgIyMgcG9zaXRpb246IGJvdHRvbSB8IHRvcCB8IGN1c3RvbT9cblx0XHRcdFx0eDogMFxuXHRcdFx0XHRoZWlnaHQ6IDQ4XG5cdFx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cblx0XHRcdHRhYldpZHRoID0gU2NyZWVuLndpZHRoIC8gQG9wdGlvbnMudGFicy5sZW5ndGhcblxuXHRcdFx0dGFiQmFyID0gbmV3IExheWVyXG5cdFx0XHRcdG5hbWU6IFwiVGFiQmFyXCJcblx0XHRcdFx0cGFyZW50OiB0YWJCYXJDb21wb25lbnRcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcdGhlaWdodDogNDggIyAjIHBlciBwbGF0Zm9ybVxuXHRcdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQG9wdGlvbnMudGFiQmFyQ29sb3JcblxuXHRcdFx0dGFiQmFyLnN0YXRlcyA9XG5cdFx0XHRcdHNob3c6XG5cdFx0XHRcdFx0eTogMFxuXHRcdFx0XHRcdGFuaW1hdGlvbk9wdGlvbnM6XG5cdFx0XHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoNDAwLCA0MCwgMClcIlxuXHRcdFx0XHRcdFx0dGltZTogMC4wMVxuXHRcdFx0XHRoaWRlOlxuXHRcdFx0XHRcdHk6IHRhYkJhci55IC0gKHRhYkJhci5oZWlnaHQgKiAyKVxuXHRcdFx0XHRcdGFuaW1hdGlvbk9wdGlvbnM6XG5cdFx0XHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoNDAwLCA0MCwgMClcIlxuXHRcdFx0XHRcdFx0dGltZTogMC4wNVxuXG5cdFx0XHQjIGFjdGl2ZUluZGljYXRvclxuXHRcdFx0QG9wdGlvbnMuaW5kaWNhdG9yQ29sb3IgPz0gQG9wdGlvbnMuaWNvbkNvbG9yXG5cdFx0XHRhY3RpdmVJbmRpY2F0b3IgPSBuZXcgTGF5ZXJcblx0XHRcdFx0bmFtZTogXCJUYWJJbmRpY2F0b3JcIlxuXHRcdFx0XHRwYXJlbnQ6IHRhYkJhclxuXHRcdFx0XHR4OiB0YWJXaWR0aCAqIEBvcHRpb25zLmFjdGl2ZVxuXHRcdFx0XHR5OiBBbGlnbi5ib3R0b21cblx0XHRcdFx0aGVpZ2h0OiAyXG5cdFx0XHRcdHdpZHRoOiB0YWJXaWR0aFxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IEBvcHRpb25zLmluZGljYXRvckNvbG9yXG5cdFx0XHRpZiBAb3B0aW9ucy5hY3RpdmVJbmRpY2F0b3IgaXMgZmFsc2Vcblx0XHRcdFx0dGFiSW5kLnZpc2libGUgPSBmYWxzZVxuXG5cdFx0XHRtb3ZlYWN0aXZlSW5kaWNhdG9yID0gKHBvcywgZHVyKSAtPlxuXHRcdFx0XHRhY3RpdmVJbmRpY2F0b3IuYW5pbWF0ZVxuXHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHR4OiBwb3Ncblx0XHRcdFx0XHR0aW1lOiBkdXJcblx0XHRcdFx0XHRjdXJ2ZTogQmV6aWVyLmVhc2VJbk91dFxuXG5cdFx0XHQjIHRhYnNcblx0XHRcdHRlbXBUYWJzID0gW11cblx0XHRcdEBvcHRpb25zLnRhYnMuZm9yRWFjaCAoaXRlbSwgaSkgPT5cblx0XHRcdFx0dGFiID0gbmV3IExheWVyXG5cdFx0XHRcdFx0cGFyZW50OiB0YWJCYXJcblx0XHRcdFx0XHRuYW1lOiBpdGVtLm5hbWUudG9Mb3dlckNhc2UoKSArIFwiVGFiXCJcblx0XHRcdFx0XHR4OiBpICogdGFiV2lkdGhcblx0XHRcdFx0XHR5OiAwXG5cdFx0XHRcdFx0aGVpZ2h0OiA0OFxuXHRcdFx0XHRcdHdpZHRoOiB0YWJXaWR0aFxuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdFx0XHR0YWIuYWRkQ2hpbGQoaXRlbSlcblx0XHRcdFx0aXRlbS54ID0gQWxpZ24uY2VudGVyXG5cdFx0XHRcdGl0ZW0uY2hpbGRyZW5bMF0uY29sb3IgPSBAb3B0aW9ucy5pY29uQ29sb3Jcblx0XHRcdFx0dGFiLnN0YXRlcyA9XG5cdFx0XHRcdFx0YWN0aXZlOlxuXHRcdFx0XHRcdFx0b3BhY2l0eTogMS4wXG5cdFx0XHRcdFx0XHRncmF5c2NhbGU6IDBcblx0XHRcdFx0XHRpbmFjdGl2ZTpcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDAuNVxuXHRcdFx0XHRcdFx0Z3JheXNjYWxlOiAxMDBcblx0XHRcdFx0dGFiLnN0YXRlU3dpdGNoKFwiaW5hY3RpdmVcIilcblxuXHRcdFx0XHRpZiBAb3B0aW9ucy50YWJMYWJlbFxuXHRcdFx0XHRcdEBvcHRpb25zLmxhYmVsQ29sb3IgPz0gQG9wdGlvbnMuaWNvbkNvbG9yXG5cdFx0XHRcdFx0bGFiZWwgPSBuZXcgVGV4dExheWVyXG5cdFx0XHRcdFx0XHRuYW1lOiBpdGVtLm5hbWUudG9Mb3dlckNhc2UoKSArIFwiTGFiZWxcIlxuXHRcdFx0XHRcdFx0cGFyZW50OiB0YWJcblx0XHRcdFx0XHRcdHg6IEFsaWduLmNlbnRlclxuXHRcdFx0XHRcdFx0eTogQWxpZ24uYm90dG9tXG5cdFx0XHRcdFx0XHR0ZXh0OiBpdGVtLm5hbWUudG9VcHBlckNhc2UoKVxuXHRcdFx0XHRcdFx0dGV4dEFsaWduOiBcImNlbnRlclwiXG5cdFx0XHRcdFx0XHRmb250U2l6ZTogMTRcblx0XHRcdFx0XHRcdGZvbnRGYW1pbHk6IFwiUm9ib3RvXCJcblx0XHRcdFx0XHRcdGNvbG9yOiBAb3B0aW9ucy5sYWJlbENvbG9yXG5cblx0XHRcdFx0c2VjdGlvbiA9IG5ldyBGbG93Q29tcG9uZW50XG5cdFx0XHRcdFx0bmFtZTogaXRlbS5uYW1lLnRvTG93ZXJDYXNlKCkgKyBcIkZsb3dcIlxuXHRcdFx0XHRcdHBhcmVudDogdGFiQ29udGVudFxuXHRcdFx0XHRcdHg6IHRhYkNvbnRlbnQud2lkdGggKiBpXG5cdFx0XHRcdFx0eTogMFxuXHRcdFx0XHRcdHNpemU6IHRhYkNvbnRlbnQuc2l6ZVxuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG5cdFx0XHRcdGlmIEBvcHRpb25zLnRhYkJhckhpZGVcblx0XHRcdFx0XHRzZWN0aW9uLm9uU2Nyb2xsU3RhcnQgLT5cblx0XHRcdFx0XHRcdGlmIGV2ZW50Lm9mZnNldERpcmVjdGlvbiA9PSBcInVwXCJcblx0XHRcdFx0XHRcdFx0dGFiQmFyLmFuaW1hdGUoXCJoaWRlXCIpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHRhYkJhci5hbmltYXRlKFwic2hvd1wiKVxuXG5cdFx0XHRcdHRlbXBUYWJzLnB1c2goe3RhYjogdGFiLCBmbG93OiBzZWN0aW9ufSlcblxuXHRcdFx0XHR0YWIub25DbGljayA9PlxuXHRcdFx0XHRcdEBvcHRpb25zLmFjdGl2ZSA9IGlcblx0XHRcdFx0XHRAYWN0aXZhdGVUYWIoaSlcblxuXHRcdFx0QG9wdGlvbnMudGFicyA9IHRlbXBUYWJzXG5cblx0XHRcdEBhY3RpdmF0ZVRhYiA9IChwb3MpIC0+XG5cdFx0XHRcdEBvcHRpb25zLnRhYnNbcG9zXS50YWIuc2libGluZ3MuZm9yRWFjaCAoaXRlbSkgLT5cblx0XHRcdFx0XHRpZiBpdGVtIGlzbnQgYWN0aXZlSW5kaWNhdG9yXG5cdFx0XHRcdFx0XHRpdGVtLnN0YXRlU3dpdGNoKFwiaW5hY3RpdmVcIilcblx0XHRcdFx0QG9wdGlvbnMudGFic1twb3NdLnRhYi5zdGF0ZVN3aXRjaChcImFjdGl2ZVwiKVxuXHRcdFx0XHRtb3ZlYWN0aXZlSW5kaWNhdG9yKHRhYldpZHRoICogcG9zLCAwLjIpXG5cdFx0XHRcdGNvbnRlbnRzTWFwID0gQG9wdGlvbnMudGFicy5tYXAgKHNlY3Rpb24pIC0+IHNlY3Rpb24uZmxvd1xuXHRcdFx0XHRqID0gY29udGVudHNNYXAuaW5kZXhPZih0YWJDb250ZW50LmN1cnJlbnQpXG5cdFx0XHRcdGlmIEBvcHRpb25zLmFjdGl2ZSA8IGpcblx0XHRcdFx0XHR0cmFuc2l0aW9uID0gc2xpZGVJbkxlZnRcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHRyYW5zaXRpb24gPSBzbGlkZUluUmlnaHRcblx0XHRcdFx0dGFiQ29udGVudC50cmFuc2l0aW9uKEBvcHRpb25zLnRhYnNbcG9zXS5mbG93LCB0cmFuc2l0aW9uKVxuXHRcdFx0XHRtb3ZlYWN0aXZlSW5kaWNhdG9yKHRhYldpZHRoICogcG9zLCAwLjIpXG5cdFx0IyBlbmQgQGxheW91dCgpXG5cblx0XHRAbGF5b3V0KClcblxuXHRcdEBhY3RpdmF0ZVRhYihAb3B0aW9ucy5hY3RpdmUpXG5cblx0QGRlZmluZSAndGFicycsXG5cdFx0Z2V0OiAtPlxuXHRcdFx0QG9wdGlvbnMudGFic1xuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QG9wdGlvbnMudGFicyA9IHZhbHVlXG5cblxuXHRcdCMgVGFiIEJhciBUcmFuc2l0aW9uc1xuXHRcdHNsaWRlSW5SaWdodCA9IChuYXYsIGxheWVyQSwgbGF5ZXJCLCBvdmVybGF5KSAtPlxuXHRcdFx0dHJhbnNpdGlvbiA9XG5cdFx0XHRcdGxheWVyQTpcblx0XHRcdFx0XHRzaG93OlxuXHRcdFx0XHRcdFx0eDogMCwgeTogMFxuXHRcdFx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHRcdFx0Y3VydmU6IEJlemllci5lYXNlSW5PdXRcblx0XHRcdFx0XHRcdFx0dGltZTogLjNcblx0XHRcdFx0XHRoaWRlOlxuXHRcdFx0XHRcdFx0eDogLW5hdi53aWR0aCwgeTogMFxuXHRcdFx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHRcdFx0Y3VydmU6IEJlemllci5lYXNlSW5PdXRcblx0XHRcdFx0XHRcdFx0dGltZTogLjNcblx0XHRcdFx0bGF5ZXJCOlxuXHRcdFx0XHRcdHNob3c6XG5cdFx0XHRcdFx0XHR4OiAwLCB5OiAwXG5cdFx0XHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRjdXJ2ZTogQmV6aWVyLmVhc2VJbk91dFxuXHRcdFx0XHRcdFx0XHR0aW1lOiAuM1xuXHRcdFx0XHRcdGhpZGU6XG5cdFx0XHRcdFx0XHR4OiBuYXYud2lkdGgsIHk6IDBcblx0XHRcdFx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdGN1cnZlOiBCZXppZXIuZWFzZUluT3V0XG5cdFx0XHRcdFx0XHRcdHRpbWU6IC4zXG5cdFx0c2xpZGVJbkxlZnQgPSAobmF2LCBsYXllckEsIGxheWVyQiwgb3ZlcmxheSkgLT5cblx0XHRcdHRyYW5zaXRpb24gPVxuXHRcdFx0XHRsYXllckE6XG5cdFx0XHRcdFx0c2hvdzpcblx0XHRcdFx0XHRcdHg6IDAsIHk6IDBcblx0XHRcdFx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdGN1cnZlOiBCZXppZXIuZWFzZUluT3V0XG5cdFx0XHRcdFx0XHRcdHRpbWU6IC4zXG5cdFx0XHRcdFx0aGlkZTpcblx0XHRcdFx0XHRcdHg6IG5hdi53aWR0aCwgeTogMFxuXHRcdFx0XHRcdFx0b3B0aW9uczpcblx0XHRcdFx0XHRcdFx0Y3VydmU6IEJlemllci5lYXNlSW5PdXRcblx0XHRcdFx0XHRcdFx0dGltZTogLjNcblx0XHRcdFx0bGF5ZXJCOlxuXHRcdFx0XHRcdHNob3c6XG5cdFx0XHRcdFx0XHR4OiAwLCB5OiAwXG5cdFx0XHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRjdXJ2ZTogQmV6aWVyLmVhc2VJbk91dFxuXHRcdFx0XHRcdFx0XHR0aW1lOiAuM1xuXHRcdFx0XHRcdGhpZGU6XG5cdFx0XHRcdFx0XHR4OiAtbmF2LndpZHRoLCB5OiAwXG5cdFx0XHRcdFx0XHRvcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRjdXJ2ZTogQmV6aWVyLmVhc2VJbk91dFxuXHRcdFx0XHRcdFx0XHR0aW1lOiAuM1xubW9kdWxlLmV4cG9ydHMgPSBUYWJCYXJDb21wb25lbnRcbiIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBRUFBOztBREFBOzs7Ozs7Ozs7Ozs7OztBQUFBLElBQUEseUJBQUE7RUFBQTs7O0FBaUJBLFFBQUEsR0FDQztFQUFBLGNBQUEsRUFBZ0IsS0FBaEI7RUFDQSxPQUFBLEVBQVMsS0FBSyxDQUFDLEdBRGY7RUFFQSxVQUFBLEVBQVksSUFGWjtFQUdBLElBQUEsRUFBTSxFQUhOO0VBSUEsTUFBQSxFQUFRLENBSlI7RUFLQSxTQUFBLEVBQVcsU0FMWDtFQU1BLFVBQUEsRUFBWSxJQU5aO0VBT0EsV0FBQSxFQUFhLFNBUGI7RUFRQSxRQUFBLEVBQVUsS0FSVjtFQVNBLGVBQUEsRUFBaUIsSUFUakI7RUFVQSxjQUFBLEVBQWdCLElBVmhCOzs7QUFZSztBQUNMLE1BQUE7Ozs7RUFBYSx5QkFBQyxPQUFEO0lBQUMsSUFBQyxDQUFBLDRCQUFELFVBQVM7SUFDdEIsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFDLENBQUMsTUFBRixDQUFTLEVBQVQsRUFBYSxRQUFiLEVBQXVCLElBQUMsQ0FBQSxPQUF4QjtJQUNYLGlEQUFNLElBQUMsQ0FBQSxPQUFQO0lBRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7QUFDVCxZQUFBO0FBQUE7QUFBQSxhQUFBLHFDQUFBOztVQUNDLEtBQUssQ0FBQyxPQUFOLENBQUE7QUFERDtRQUdBLEtBQUMsQ0FBQSxLQUFELEdBQVMsTUFBTSxDQUFDO1FBQ2hCLEtBQUMsQ0FBQSxNQUFELEdBQVU7UUFDVixLQUFDLENBQUEsZUFBRCxHQUFtQjtRQUVuQixVQUFBLEdBQWlCLElBQUEsYUFBQSxDQUNoQjtVQUFBLElBQUEsRUFBTSxnQkFBTjtVQUNB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
