from . import main


@main.route("/")
def index():
    # will return React SPA in production (or semi-production) ready app
    return {"index": "hello world"}
