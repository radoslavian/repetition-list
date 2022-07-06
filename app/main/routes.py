from . import main


@main.route("/")
def index():
    return {"index": "hello world"}
