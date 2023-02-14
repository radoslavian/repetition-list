from flask import Blueprint

error_handlers = Blueprint("error_handlers", __name__)

from . import routes