(function(enyo, scope) {
	/**
	* Instantiates and loads [iLib]{@link ilib} and its resources.
	*
	* @private
	*/
	window.moon = window.moon || {};
	/**
	* Localized strings from [iLib]{@link ilib} translations.
	*
	* @param {String} string - String to be localized.
	* @returns {String} Localized string.
	* @name moon.$L
	* @public
	*/
	if (window.ilib) {
		moon.$L = (function() {
			var lfunc = function (string) {
				if (!moon.$L.rb) {
					return string;
				}
				var str = moon.$L.rb.getString(string);
				return str.toString();
			};
			lfunc.rb = new ilib.ResBundle({
				loadParams: {
					root: '$lib/moonstone/resources'
				}
			});
			return lfunc;
		})();
	} else {
		moon.$L = $L || function(s) { return s; };
	}
})();
