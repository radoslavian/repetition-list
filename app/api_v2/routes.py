# POST /v1/add-task -> POST /v2/tasks
# GET /v1/task/int:task_id -> GET /v2/tasks/int:task_id
# DELETE /v1/task/int:task_id -> DELETE /v2/tasks/int:task_id
# PATCH /v1/task/int:task_id/reset -> POST /v2/tasks/int:task_id/reset
# GET /v1/task/int:task_id/reviews -> removed (serialize reviews into task data)
# PATCH /v1/task/int:task_id/status -> POST /v2/tasks/int:task_id/status
#
# NEW: PUT /v2/tasks/task_id:int
# for updating whole task data (is this necessary? I want be updating
# ReviewData anyway).

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
