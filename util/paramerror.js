class ParamError extends Error {
    constructor(code = 401, msg) {
        super(msg)
        this.msg = msg
        this.code = code;
    }
}

module.exports = ParamError