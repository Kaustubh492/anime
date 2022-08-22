from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.middleware.base import RequestResponseEndpoint
from requests import ConnectionError
from errors.http_error import internal_server_500


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        try:
            return await call_next(request)
        except ConnectionError:
            return await internal_server_500(request, msg="Remote server unreachable, please check your internet connection or try again after sometime")
