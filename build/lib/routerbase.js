"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class routerHandler {
    constructor(r) {
        this.router = r;
        this.handler = this.routerWarp();
    }
    routerWarp() {
        let self = this;
        let methodHandler = (method) => {
            return (path, ...args) => {
                let func = args.pop();
                self.router[method](path, ...args, async (req, res, next) => {
                    try {
                        await func(req, res, next);
                    }
                    catch (e) {
                        next(e);
                    }
                });
            };
        };
        return {
            "get": methodHandler("get"),
            "post": methodHandler("post"),
            "put": methodHandler("put"),
            "patch": methodHandler("patch"),
            "delete": methodHandler("delete")
        };
    }
}
exports.routerHandler = routerHandler;

//# sourceMappingURL=../maps/lib/routerbase.js.map
