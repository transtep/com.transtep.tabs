;(function($, self) {
"use strict";

var	container, current_element,
	tabs_settings = self.data.property.client.get('tabs_settings'),
	current_index = 1e5;
try {
	tabs_settings = JSON.parse(tabs_settings);
} catch(e) {
	console.error('機台參數 tabs_settings 設定錯誤 ', tabs_settings);
	tabs_settings = {};
}

$.fn.switchTabs = function (index) {
	if(current_index===index) {
		return false;
	}
	current_element && current_element.removeClass('current');
	$(this).addClass('current');
	current_element = $(this);
	current_index = index;

	var ctrl = self.ctrl,
		shelf = ctrl.shelf;
	if(index == 1e5) {
		shelf.display_channel = [1, 1e5];
	} else {
		shelf.display_channel = [shelf.system.start_host_channel[index],
			shelf.system.start_host_channel[index] + shelf.system.total_host_channel[index] - 1];
	}
	 ctrl.trigger('shelf.one.show', {lock: true});		//單純切換頁籤時不刷新商品資訊
}

/**
 * 鉤子載入成功觸發
 */
self.hook_init = function() {
	self.tabs.show();
	container = $('#tabs').empty();

	tabs_settings = $.extend({1e5: {name: "全部"}}, tabs_settings);

	$.each(tabs_settings, function(index, val) {
		index = +index == 1e5 ? 1e5 : +index + 1;
		$('<li></li>').append($('<div class="area '+val['name']+' ' + (index!=1e5 ? '' : 'all current')+ '"><div class="icon"></div><span>' + val['name'] + '</span><div class="rays"></div></div>').on('mousedown touchstart', hook('onclick', index)))
		.appendTo(container);
	});

	current_element = container.find('.current');
}

/**
 * 按鈕點擊事件 + 水滴特效
 */
self.hook_onclick = function(index) {
	var timestamp, $ripple, offset;
	return function(e) {
		if(Date.now() - timestamp < 300) {
			return;
		} else if(timestamp==null) {
			offset = $(this).offset();
			$ripple = $('<span class="ripple"></span>');
			$ripple.appendTo(this);
		}

		if(current_index!=index) {
			$ripple.removeClass('show');
			$ripple.css({
				top: e.pageY - offset.top - $ripple.height() / 2 - document.body.scrollTop,
				left: e.pageX - offset.left - $ripple.width() / 2 - document.body.scrollLeft
			});
			$ripple.addClass('show');
		}

		$(this).switchTabs(index);

		timestamp = Date.now();
		e.preventDefault();
	};
}

})(jQuery, window);
