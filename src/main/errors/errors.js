export class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "BadRequestError";
        this.status = 400;
    }
}

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
        this.status = 401;
    }
}

export class ForbiddenError extends Error {
    constructor(message = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
        this.status = 403;
    }
}

export class NotFoundError extends Error {
    constructor(message = "Not Found") {
        super(message);
        this.name = "NotFoundError";
        this.status = 404;
    }
}