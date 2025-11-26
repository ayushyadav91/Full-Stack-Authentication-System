class ApiResponse {
    constructor(StatusCode, data, message = "Request successful") {
        this.statusCode = StatusCode;
        this.data = data;
        this.message = message;
    }
}

export default ApiResponse;