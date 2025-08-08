
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { error } from 'console';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response
            .status(status)
            .json({
                // statusCode: status,
                // timestamp: new Date().toISOString(),
                // path: request.url,

                error: "Payload Too Large",
                message: "File too large customize",  // lưu ý đây chỉ là đang customize 1 trường hợp nên là sai gì cũng báo về lỗi này, nghiên cứu config lại các case khác sau
                statusCode: status
            });

        //     // Nếu là lỗi file size của Multer
        // if (exception instanceof MulterError && exception.code === 'LIMIT_FILE_SIZE') {
        //     return response.status(413).json({
        //         error: 'Payload Too Large',
        //         message: 'File too large customize',
        //         statusCode: 413,
        //     });
        // }

        // // Nếu là HttpException khác
        // if (exception instanceof HttpException) {
        //     return response.status(status).json({
        //         error: exception.name,
        //         message: exception.message,
        //         statusCode: status,
        //     });
        // }

        // // Lỗi không xác định
        // return response.status(500).json({
        //     error: 'Internal Server Error',
        //     message: 'Unexpected error occurred',
        //     statusCode: 500,
        // });
    }
}
