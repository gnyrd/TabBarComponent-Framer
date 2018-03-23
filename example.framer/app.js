var TabBarComponent, tb;

TabBarComponent = require("TabBarComponent");

tb = new TabBarComponent({
  y: 128,
  tabs: [Home, Photos, Store],
  active: 0,
  tabLabel: true,
  labelColor: "black"
});

tb.activateTab(0);

tb.tabs[0].contents.showNext(pageA);

tb.tabs[1].contents.showNext(pageB);

tb.tabs[2].contents.showNext(pageD);
