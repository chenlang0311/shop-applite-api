import { Router, RequestHandler, Request, Response, NextFunction } from 'express';

export class routerHandler {
    public handler: any;
    private router: Router;

    constructor(r: Router) {
        this.router = r;
        this.handler = this.routerWarp();
    }

    private routerWarp() {
        let self = this;
        let methodHandler = (method: string) => {
            return (path: string, ...args: RequestHandler[]) => {
                let func = args.pop();
                (self.router as any)[method](path, ...args, async (req: Request, res: Response, next: NextFunction) => {
                    try {
                        await func(req, res, next);
                    } catch (e) {
                        next(e);
                    }
                });
            }
        }

        return {
            "get": methodHandler("get"),
            "post": methodHandler("post"),
            "put": methodHandler("put"),
            "patch": methodHandler("patch"),
            "delete": methodHandler("delete")
        }
    }
}