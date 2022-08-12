from app import db
from datetime import datetime
from flask import request, jsonify, abort, make_response
from sqlalchemy.exc import InvalidRequestError
from ..models import Task, ReviewError
from . import api_v1


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
    return make_response({"error": "Not Found"}, 404)


@api_v1.route("/")
def index():
    return {"index": "hello world"}


@api_v1.route("/v1/add-task", methods=["POST"])
def add_task():
    if request.is_json:
        if request.json.get("due_date"):
            data = {**request.json,
                    "due_date": datetime.strptime(
                        request.json.get("due_date"), '%Y-%m-%d').date()}
        else:
            data = request.json
        try:
            db.session.add(Task(**data))
            db.session.commit()
        except (ValueError, TypeError) as e:
            db.session.rollback()
            abort(400, str(e))

    return make_response({"status": "Created"}, 201)


@api_v1.route("/v1/task/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = Task.query.filter_by(id=task_id).first_or_404()

    return make_response({"title": task.title,
                          "active": task.active,
                          "description": task.description,
                          "intro_date": task.intro_date.isoformat(),
                          "due_date": task.due_date.isoformat(),
                          "multiplier": task.multiplier})


@api_v1.route("/v1/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()

    return make_response(
        jsonify([{"id": task.id,
                  "title": task.title,
                  "active": task.active,
                  "description": task.description,
                  "intro_date": task.intro_date.isoformat(),
                  "due_date": task.due_date.isoformat(),
                  "multiplier": task.multiplier} for task in tasks]))


@api_v1.route("/v1/task/<int:task_id>/update", methods=["PATCH"])
def update_task(task_id):
    if not request.is_json or not request.json:
        abort(400, "Request should be in json format.")
    task_query = db.session.query(Task).filter(Task.id == task_id)
    try:
        if task_query.count() < 1:
            raise ValueError(f"Task with a given id {task_id} was not found.")

        # Initially I thought I would reset intro_date from the UI,
        # it turned out later it is better to do it
        # on the server
        dates = {
            k: datetime.strptime(request.json[k], '%Y-%m-%d').date()
            for k in filter(lambda key: key in request.json,
                            {"intro_date", "due_date"})
        }
        task_data = {**request.json, **dates} if dates else request.json

        # multiplier, title have to be checked by hand - query.update doesn't
        # run model validators
        if request.json.get("multiplier", 1.0) < 1.0:
            raise ValueError("Task multiplier must be > 0.")
        if request.json.get("title", "title") == "":
            raise ValueError("Cannot set title to an empty string.")
        try:
            task_query.update(task_data)
            db.session.commit()
        except InvalidRequestError as e:
            db.session.rollback()
            raise ValueError(str(e))
    except ValueError as e:
        abort(400, str(e))
    return make_response({"status": "updated"}, 200)


@api_v1.route("/v1/task/<int:task_id>/tick-off", methods=["PUT"])
def tick_off(task_id):
    task = Task.query.filter_by(id=task_id).first_or_404()
    try:
        task.tick_off()
    except ReviewError:
        abort(400)
    return make_response({"status": "updated"}, 200)


@api_v1.route("/v1/task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.filter_by(id=task_id).first_or_404()
    db.session.delete(task)
    db.session.commit()

    return make_response({
        "taskId": task.id,
        "status": "deleted"
    }, 200)


@api_v1.route("/v1/task/<int:task_id>/reset", methods=["PATCH"])
def reset_task(task_id):
    task = Task.query.filter_by(id=task_id).first_or_404()
    task.reset()

    return make_response({
        "taskId": task.id,
        "status": "reset"
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

    task = Task.query.filter_by(id=task_id).first_or_404()
    task.active = not task.active
    db.session.add(task)
    db.session.commit()

    return make_response(
        {"taskId": task.id,
         "status": f"task status changed to active={task.active}"}, 200)
