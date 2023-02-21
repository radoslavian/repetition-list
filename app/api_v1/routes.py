from flask import request

from . import api_v1
from app.utils.api_helpers import *
from ..models import Task
from ..utils.api_helpers import get_all_tasks_as_response, \
    make_response_from_updated_task


@api_v1.route("/add-task", methods=["POST"])
def add_task():
    task = add_task_from_request(request)

    return make_response({"status": "Created",
                          "taskId": task.id}, 201)


@api_v1.route("/task/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = get_task_by_id_or_404(task_id)

    return make_response(task.to_dict(), 200)


@api_v1.route("/tasks", methods=["GET"])
def get_tasks():
    return get_all_tasks_as_response()


@api_v1.route("/task/<int:task_id>/update", methods=["PATCH"])
def update_task(task_id):
    return make_response_from_updated_task(task_id, request)


@api_v1.route("/task/<int:task_id>/tick-off", methods=["PUT"])
def tick_off_task(task_id):
    task = tick_off_task_by_id(task_id)

    return make_response({"status": "updated",
                          "due_date": task.due_date.isoformat()}, 200)


@api_v1.route("/task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    delete_task_by_id_or_404(task_id)

    return make_response("", 204)


@api_v1.route("/task/<int:task_id>/reset", methods=["PATCH"])
def reset_task(task_id):
    task = reset_task_by_id(task_id)

    return make_response({
        "intro_date": task.intro_date.isoformat(),
        "due_date": task.due_date.isoformat(),
        "multiplier": task.multiplier
    }, 200)


@api_v1.route("/task/<int:task_id>/reviews", methods=["GET"])
def get_task_reviews(task_id):
    task = Task.query.get_or_404(task_id)

    return make_response(jsonify([{
        "reviewed_on": data_item.reviewed_on,
        "prev_due_date": data_item.prev_due_date,
        "multiplier": data_item.multiplier
    } for data_item in task.reviews]), 200)


@api_v1.route("/task/<int:task_id>/status", methods=["PATCH"])
def change_task_status(task_id):
    """Toggle task status (active <--> inactive)."""

    task = change_task_status_by_id(task_id)
    return make_response(task.to_dict(), 200)
