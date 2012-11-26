define(["require", "exports", 'views/HomeView', 'views/HomeView2'], function(require, exports, __HomeView__, __HomeView2__) {
    var HomeView = __HomeView__;

    var HomeView2 = __HomeView2__;

    /**
    * Testing comment / config??? d
    */
    var Application = (function () {
        function Application() {
            console.log('initializing Applicationz', HomeView, HomeView2);
        }
        return Application;
    })();
    exports.Application = Application;    
})

//@ sourceMappingURL=Application.js.map
