define(["require", "exports", 'views/HomeView'], function(require, exports, __HomeView__) {
    var HomeView = __HomeView__;

    var Application = (function () {
        function Application() {
            console.log('initializing Applicationz', HomeView);
        }
        return Application;
    })();
    exports.Application = Application;    
})

//@ sourceMappingURL=Application.js.map
