(function(global, factory, plug) {
    factory.call(global, global.jQuery, plug);
}(typeof window === 'undefined' ? this : window, function($, plug) {

    let  __I18N__ = {
        en: {
            errorMsg: "* This content is invalid.",
            notForm: "* The element is not a form."
        }
    };

    let __DEF__ = {
        raise: 'change',
        pix: 'bv-',
        lang: 'en',
        errorMsg: null
    };

    let __RULES__ = {
        require: function() {
            return this.val() && this.val() !== "";
        },
        email: function() {
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.val());
        },
        number: function() {
            return !isNaN(this.val());
        },
        length: function() {
            return this.val().length === Number(this.data(__DEF__.pix + 'length'));
        },
        regex: function() {
            return new RegExp(this.data(__DEF__.pix + 'regex')).test(this.val());
        },
    };

    $.fn[plug] = function(opt) {
        let that = $.extend(this, __DEF__, opt);
        that.getMessage = $.fn[plug].getMessage;
        if (this.is('form')) {
            var $fields = this.find("input, textarea, select").not('[type=submit], [type=button], [type=reset]');
            $fields.on(this.raise, function() {
                let $field = $(this);
                let $group = $field.parents("div:first");
                $group.find('.help-block').remove();
                let result = false;
                let msg = that.getMessage(that.lang, 'errorMsg');
                $.each(__RULES__, function(rule, active) {
                    if ($field.data(that.pix + rule)) {
                        result = active.call($field);
                        if (!result) {
                            msg = $field.data(that.pix + rule + '-message') || that.errorMsg;
                            $field.removeClass('has-error has-success')
                                .addClass('has-error')
                                .after("<span class=\"help-block\">" + msg + "</span>");
                            return false;
                        } else {
                            $field.removeClass('has-error has-success')
                                  .addClass('has-success');
                        }
                    }
                });
            });
            this.extendRules = $.fn[plug].extendRules;
            return this;
        } else {
            throw new Error(that.getMessage(that.lang, 'notForm'));
        }
    };
    $.fn[plug].extendRules = function(rules) {
        $.extend(__RULES__, rules);
    };
    $.fn[plug].addLanguage = function(lang, data) {
        __I18N__[lang] = data;
    };
    $.fn[plug].getMessage = function(lang, key) {
        return __I18N__[lang][key];
    }
}, 'validator'));
