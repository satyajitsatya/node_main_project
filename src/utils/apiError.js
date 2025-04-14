class ApiErrors extends Error {
    constructor(statusCode , message = 'somthing went wrong' , errors =  [] , stack = '')
    {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.data= null
        this.success = false
        this.errors = errors

        if(stack)
        {
            this.statck = stack

        }
        else
        {
            Error.captureStackTrace(this , this.constructor)
        }


    }
}

export {ApiErrors}