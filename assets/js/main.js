;(function($, self) {
$(function() {
"use strict";

var options = (function() {
	var options = {};

	options = {
	};
	return options;
}());

var	ul = $('#tabs'),
	current_index,
	system_tabs = JSON.parse(self.data.property.client.get('tabs_settings')) || {};

/* 構造函數：頁籤控制器與主控制器之間的渠道 */
var Tabs = function() {
};
Tabs.prototype = {
	constructor: Tabs,
	/* (非必須存在)初始化：與控制器界接成功後會觸發此方法 */
	initialize: function() {
		ul.empty();
		if(Object.keys(system_tabs).length) {
			system_tabs = $.extend({1e5: {name: "全部"}}, system_tabs);

			$.each(system_tabs, function(index, val) {
				index = +index == 1e5 ? 1e5 : +index + 1;
				$('<li>' + val['name'] + '</li>')
				.on('click', function() {
					var shelf = ctrl.shelf;
					if(index == 1e5) {
						shelf.display_channel = [1, 1e5];
					} else {
						shelf.display_channel = [shelf.system.start_host_channel[index],
							shelf.system.start_host_channel[index] + shelf.system.total_host_channel[index] - 1];
					}
					ctrl.trigger('shelf.one.show');
				})
				.appendTo(ul);
			});
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