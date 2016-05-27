;(function($, self) {
"use strict";
/* 唯一識別名 */
var id = self.id = '.' + ('' + Math.random() ).replace( /\D/g, "" ),
/* 控制器變量 */
ctrl, tabs, loading = $.Callbacks('memory unique');
/* 負責 xml config 的處理 */
self.options = (function() {
	var	options = {
		style: './css/style201605.css',
		script: './js/hook_base.js'
	};

	if('getPreference' in self) {	//把 shelf_ 全接收進參數
		try {
			$.each(self.getPreference({}), function(key, val) {
				if(key.indexOf('tabs_')==0) {
					try {
						options[ key.substring(5) ] =
							val === 'false' ? !1 :
							val === 'true' ? !0 :
							+val+'' === val ? +val :
							/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(val) ? JSON.parse(val.replace(/\'/g, '"')) :
							val;
					} catch( e ) {}
				}
			});
		} catch( e ) {console.error('ivm-0.0.29 以上才支援 getPreference({}) 用法')}
	}

	/* 按照檔案順序加載js *//* 加載 css */
	var extensions = function(path, html, callback) {
		var defer;
		if($.isArray(path)) {
			extensions(path.shift(), html, function() {	//LIFO, 可處理多層次數組
				if(path.length) {
					extensions(path, html, callback);
				} else {	//全部加載完才執行 callback
					callback && callback();
				}
			});
			return false;
		} else if(typeof path == 'string' && path.length) {
			if(html) {
				$('head').append(html.replace('$0', path));
			} else {	//js 有 defer，當前加載完才能加載下一個
				defer = $.Deferred();
				$.getScript(path).always(function() { defer.resolve() }).fail(function() { console.error('error: '+path) });
			}
		}
		callback && $.when(defer).then(callback);
	}

	extensions(options.script, false, function() {	//js 採用延遲方法
		$(init);	//所有js文件載入完成後才准許執行 plugin 主要功能
	});
	extensions(options.style, '<link rel="stylesheet" href="$0">');

	return options;
}());

function init() {	/* 全部加載完才顯示 */
	loading.add(function() {
		/* 鉤子初始化事件 */
		hook('init');
	});
};

/* 構造函數：頁籤控制器與主控制器之間的渠道 */
var Tabs = function() {
};
Tabs.prototype = {
	constructor: Tabs,
	/* (非必須存在)初始化：與控制器界接成功後會觸發此方法 */
	initialize: function() {
		loading.fire();
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
tabs = self.tabs = new Tabs();

/* (必須存在)與主控制器界接的必要函數 */
if('exports' in self) {
	self.exports.interface = function(scope) {
		ctrl = self.ctrl = scope;
		return tabs;
	}
}
})(jQuery, window);

function hook(name) {
	var args = Array.prototype.slice.call(arguments);
	name = 'hook_' + name;
	return typeof self[name] == 'function' && self[name].apply(self, args.splice(1));
}
document.ondragstart = function (){	//防止被拖曳
	return false;
};
document.onselectstart = function (){	//防止被反白
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
