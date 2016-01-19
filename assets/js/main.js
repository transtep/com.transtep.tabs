;(function($, self) {
$(function() {
"use strict";

var options = (function() {
	var options = {};

	options = {
	};
	return options;
}());

var	container = $('#tabs'),
	system_tabs = JSON.parse(self.data.property.client.get('tabs_settings')) || {},
	imgpath = {
		"飲料機": "./images/juice.png",
		"食品機": "./images/cookie.png",
		"全部": "./images/all.png"
	},
	current_index = 1e5,
	current_element;

function switchTabs(obj, index) {
	if(current_index===index) {
		return false;
	}
	current_element && current_element.removeClass('current');
	obj.addClass('current');
	current_element = obj;
	current_index = index;

	var shelf = ctrl.shelf;
	if(index == 1e5) {
		shelf.display_channel = [1, 1e5];
	} else {
		shelf.display_channel = [shelf.system.start_host_channel[index],
			shelf.system.start_host_channel[index] + shelf.system.total_host_channel[index] - 1];
	}
	ctrl.trigger('shelf.one.show', true);
}

/* 構造函數：頁籤控制器與主控制器之間的渠道 */
var Tabs = function() {
};
Tabs.prototype = {
	constructor: Tabs,
	/* (非必須存在)初始化：與控制器界接成功後會觸發此方法 */
	initialize: function() {
		container.empty();
		if(Object.keys(system_tabs).length) {
			system_tabs = $.extend({1e5: {name: "全部"}}, system_tabs);

			$.each(system_tabs, function(index, val) {
				index = +index == 1e5 ? 1e5 : +index + 1;
				$('<a href="#" class="' + (index!=1e5 ? '' : 'all current')+ '"><img src="' + ( imgpath[val['name']] ? imgpath[val['name']] : './images/none.png' ) + '"><span>' + val['name'] + '</span><div class="rays"></div></a>')
				.on('click mousedown', function(ef) {
					if(ef.type === 'mousedown') {		//判斷戳
						$(this).off('mouseup').one('mouseup', function(e) {
							var cost = e.timeStamp - ef.timeStamp;
							if(cost < 5e2) {
								var	startXY = getTouches(ef),
									endXY = getTouches(e),
									offset = Math.abs(startXY.y - endXY.y);
								if(offset < 20) {
									switchTabs($(this), index);
								}
							}
						})
					} else {
						switchTabs($(this), index);
					}
				})
				.appendTo(container);
			});

			current_element = container.find('.current');
		}
		return this;
	},
	/* (必須存在)顯示： */
	show: function() {
		self.show();
	},
	/* (必須存在)隱藏： */
	hide: function() {
		self.hide();
	}
};

var	ctrl,
	tabs = new Tabs();

/* (必須存在)與主控制器界接的必要函數 */
if('exports' in self) {
	self.exports.interface = function(scope) {
		ctrl = scope;
		return tabs;
	}
}
});
})(jQuery, window);

//防止圖片被拖曳
document.ondragstart = function (){
	return false;
};

function getTouches(event) {
	if (event.touches !== undefined) {
		return {
			x: event.touches[0].pageX,
			y: event.touches[0].pageY
		};
	}

	if (event.touches === undefined) {
		if (event.pageX !== undefined) {
			return {
				x: event.pageX,
				y: event.pageY
			};
		}

	if (event.pageX === undefined) {
		return {
				x: event.clientX,
				y: event.clientY
			};
		}
	}
}
