from flask import make_response

from app.error_handlers import error_handlers


@error_handlers.app_errorhandler(400)
def wrong_argument(e):
    # e - error object-depending on circumstances,
    # BadRequest object in this case

    status = (e.description or
              "Bad Request: The browser (or proxy) sent a request"
              + " that this server could not perform.")

    return make_response(
        {"error": "Bad Request",
         "status": status}, 400)


#@error_handlers.errorhandler(404)
@error_handlers.app_errorhandler(404)
def resource_not_found(e):
    status = e.description or "Resource was not found on this server."
    return make_response({"error": "Not Found",
                          "status": status}, 404)
