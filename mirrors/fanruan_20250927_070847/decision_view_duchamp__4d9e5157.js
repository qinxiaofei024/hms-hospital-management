meterWrapper = ExtendedChart.extend({
    _init: function (dom, option) {
        option.container = dom;
        return new window.Van.SliderDashboard(option);
    },

    hasBackground: function () {
        return true;
    },

    _emptyData: function (options) {
        options = options || {};
        options.dataSet = options.dataSet || [];

        return options.dataSet.length < 2;
    },

    animateOverlap: function () {
        return true;
    }

});