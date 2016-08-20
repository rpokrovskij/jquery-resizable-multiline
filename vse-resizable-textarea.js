// double "immediately-Invoked Function Expression" 
// a) first search for module managers b) second protect $
; (function (window, document, undefined) {
    var pluginName = "vseResizableTextarea";
    (function( factory ) {
        "use strict";
       
        if (typeof define === 'function' && define.amd) {
            // Define as an AMD module if possible
            define(pluginName, ['jquery'], factory);
        }
        else if (typeof exports === 'object') {
            // Node/CommonJS
            module.exports = factory(require('jquery'));
        }
        else if (jQuery && !jQuery.fn.vseResizableTextarea) {
            // Define using browser globals otherwise
            // Prevent multiple instantiations if the script is loaded twice
            factory(jQuery);
        }
    }( 
        function ($) {
            "use strict";
            var defaults = {
                minHeight: "6em"
            };

            // The actual plugin constructor
            function Plugin(element, options) {
                this.element = element;
                this.options = $.extend({}, defaults, options);
                this._defaults = defaults;
                this._name = pluginName;

                this.staticOffset = null;
                this.iLastMousePos = 0;
                this.iMin = 32;

                // public methods
                this.adjustHeight = function () {
                    var textarea = this.element;
                    $(textarea).css("background-color", "red");
                    alert('adjustHeight');
                    var offset = textarea.offsetHeight - textarea.clientHeight;
                    $(textarea).css('height', 'auto').css('height', textarea.scrollHeight + offset + 10);
                };

                this.init();
            }

            Plugin.prototype = {
                init: function () {
                    $(this.element).css("min-height", this.options.minHeight);
                    $(this.element).addClass('vse-resizable-textarea');
                    $(this.element).wrap('<div class="vse-resizable-textarea-wrapper"></div>').parent()
                            .append($('<div class="vse-resizable-textarea-grippie"></div>')
                            .bind("mousedown", { plugin: this }, this.startDrag));
                    var $grippie = $('div.vse-resizable-textarea-grippie', $(this.element).parent());
                    $grippie.dblclick(
                        function () {
                            var $textarea = $(this).parent().children('textarea');
                            var textarea = $textarea[0];
                            var offset = textarea.offsetHeight - textarea.clientHeight;
                            $textarea.css('height', 'auto').css('height', textarea.scrollHeight + offset + 10);
                        });
                    var grippie = $grippie[0];
                    grippie.style.marginRight = (grippie.offsetWidth - $(this)[0].offsetWidth) + 'px'
                },

                startDrag: function startDrag(e) {
                    var plugin = e.data.plugin;
                    $(plugin.element).blur();
                    plugin.iLastMousePos = plugin.mousePosition(e).y;
                    plugin.staticOffset = $(plugin.element).height() - plugin.iLastMousePos;
                    $(plugin.element).css('opacity', 0.25);
                    $(document)
                    //.mousemove(plugin.performDrag)
                    .bind("mousemove", { plugin: plugin }, plugin.performDrag)
                    //.mouseup(plugin.endDrag);
                    .bind("mouseup", { plugin: plugin }, plugin.endDrag);
                    return false
                },

                performDrag: function (e) {
                    var plugin = e.data.plugin;
                    var iThisMousePos = plugin.mousePosition(e).y;
                    var iMousePos = plugin.staticOffset + iThisMousePos;
                    if (plugin.iLastMousePos >= iThisMousePos) {
                        iMousePos -= 5
                    }
                    plugin.iLastMousePos = iThisMousePos;
                    iMousePos = Math.max(plugin.iMin, iMousePos);
                    $(plugin.element).height(iMousePos + 'px');
                    if (iMousePos < plugin.iMin) {
                        plugin.endDrag(e)
                    }
                    return false;
                },

                endDrag: function (e) {
                    var plugin = e.data.plugin;
                    $(document).unbind('mousemove', plugin.performDrag).unbind('mouseup', plugin.endDrag);
                    $(plugin.element).css('opacity', 1);
                    $(plugin.element).focus();
                    plugin.staticOffset = null;
                    plugin.iLastMousePos = 0
                },

                mousePosition: function (e) {
                    return {
                        x: e.clientX + document.documentElement.scrollLeft,
                        y: e.clientY + document.documentElement.scrollTop
                    }
                }
            };

            // A really lightweight plugin wrapper around the constructor,
            // preventing against multiple instantiations
            $.fn[pluginName] = function (options) {
                return this.each(function () {
                    if (!$.data(this, "plugin_" + pluginName)) {
                        $.data(
                            this,
                            "plugin_" + pluginName,
                            new Plugin(this, options)
                        );
                    }
                });
            };

            $.fn[pluginName.charAt(0).toUpperCase() + pluginName.slice(1)] = function (options) {
                return $(this).data("plugin_" + pluginName);

                //return $(this).vseResizableTextarea(options).api();
            };


            return $.fn.vseResizableTextarea;
        }
     )
    );
}(window, document));

/*

    

})(jQuery, window, document);
*/