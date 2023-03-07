from flask import request, make_response

from . import api_v2
from app.utils.api_helpers import *


@api_v2.route("/tasks", methods=["GET"])
def get_tasks():
    return get_all_tasks_as_response()


@api_v2.route("/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    return make_response_from_updated_task(task_id, request)


@api_v2.route("/tasks/<int:task_id>/tick-off", methods=["POST"])
def tick_off_task(task_id):
    task = tick_off_task_by_id(task_id)
    return make_response(task.to_dict(), 200)


@api_v2.route("/tasks", methods=["POST"])
def post_task():
    task = add_task_from_request(request)
    return make_response(task.to_dict(), 201)


@api_v2.route("/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = get_task_by_id_or_404(task_id)
    return make_response(task.to_dict(), 201)


@api_v2.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    delete_task_by_id_or_404(task_id)
    return make_response("", 204)


@api_v2.route("/tasks/<int:task_id>/reset", methods=["POST"])
def reset_task(task_id):
    task = reset_task_by_id(task_id)
    return make_response(task.to_dict(), 200)


@api_v2.route("/tasks/<int:task_id>/<string:status>", methods=["POST"])
def set_status(task_id, status):
    status_bool = {
        "active": True,
        "inactive": False
    }.get(status, None)

    if status_bool is None:
        abort(400)

    def check_status(task_object):
        if task_object.active == status_bool:
            return "", 204
        task_object.active = status_bool
        task_object.save()

        return task_object.to_dict()

    task = get_task_by_id_or_404(task_id)

    return make_response(check_status(task))
