export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor)
        this.status = status;
    }
}

export class NotFoundError extends HttpError {
    constructor(message='not found') {
        super(404, message);
    }
}

export class BadRequestError extends HttpError {
    constructor(message='bad request') {
        super(400, message);
    }
}

export function onError(err, req, res, next) {
    if (err instanceof HttpError) {
        res.status(err.status).json({
            message: err.message
        })
    } else {
        res.status(500).json({
            message: 'an error occurred'
        })
    }
}