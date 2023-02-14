from flask import request, jsonify, make_response

from . import api_v1
from app.utils.api_helpers import *
from ..models import Task  # remove ReviewError


@api_v1.errorhandler(400)
def wrong_argument(e):
    # e - error object-depending on circumstances,
    # BadRequest object in this case

    status = (e.description or
              "Bad Request: The browser (or proxy) sent a request"
              + " that this server could not perform.")

    return make_response(
        {"error": "Bad Request",
         "status": status}, 400)


@api_v1.errorhandler(404)
def resource_not_found(e):
    status = e.description or "Resource was not found on this server."
    return make_response({"error": "Not Found",
                          "status": status}, 404)


@api_v1.route("/")
def index():
    # will return React SPA in production (or semi-production) ready app
    return {"index": "hello world"}


@api_v1.route("/v1/add-task", methods=["POST"])
def add_task():
    task = get_json_from_request(request)

    return make_response({"status": "Created",
                          "taskId": task.id}, 201)


@api_v1.route("/v1/task/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = get_task_by_id(task_id)

    return make_response(task.to_dict())


@api_v1.route("/v1/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()

    return make_response(
        jsonify([task.to_dict() for task in tasks]))


@api_v1.route("/v1/task/<int:task_id>/update", methods=["PATCH"])
def update_task(task_id):
    task = update_task_from_request(task_id, request)
    return make_response(task.to_dict(), 200)


@api_v1.route("/v1/task/<int:task_id>/tick-off", methods=["PUT"])
def tick_off_task(task_id):
    task = tick_off_task_by_id(task_id)
    return make_response({"status": "updated",
                          "due_date": task.due_date.isoformat()}, 200)


@api_v1.route("/v1/task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    delete_task_by_id(task_id)

    return make_response("", 204)


@api_v1.route("/v1/task/<int:task_id>/reset", methods=["PATCH"])
def reset_task(task_id):
    task = reset_task_by_id(task_id)

    return make_response({
        "intro_date": task.intro_date.isoformat(),
        "due_date": task.due_date.isoformat(),
        "multiplier": task.multiplier
    }, 200)


@api_v1.route("/v1/task/<int:task_id>/reviews", methods=["GET"])
def get_task_reviews(task_id):
    task = Task.query.get_or_404(task_id)

    return make_response(jsonify([{
        "reviewed_on": data_item.reviewed_on,
        "prev_due_date": data_item.prev_due_date,
        "multiplier": data_item.multiplier
    } for data_item in task.reviews]), 200)


@api_v1.route("/v1/task/<int:task_id>/status", methods=["PATCH"])
def change_task_status(task_id):
    """Toggle task status (active <--> inactive)."""

    task = change_task_status_by_id(task_id)
    return make_response(task.to_dict(), 200)
