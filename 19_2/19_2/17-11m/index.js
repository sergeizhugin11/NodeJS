function MVCRouter(uri_templates) {
    this.uri_templates = [...arguments];
}

function MVControllers(controllers_map) {
    this.controllers_map = controllers_map;
}

function MVC(router, controllers) {
    this.router = router;
    this.controllers = controllers;
    this.use = (req, res, next) => {
        let c = this.controllers.controllers_map[req.params.controller];
        //console.log(req.params.controller);
        //console.log(c);
        if (c) {
            let a = c[req.params.action];
           // console.log(a);
            if (a) {
                a(req, res, next);
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    }
};

exports.MVCRouter = MVCRouter;
exports.MVControllers = MVControllers;
exports.MVC = MVC;
