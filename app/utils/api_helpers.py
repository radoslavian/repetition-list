"""Helper functions for API view routes.
"""

from datetime import datetime

from sqlalchemy.exc import InvalidRequestError
from werkzeug.exceptions import abort

from app import db
from app.models import Task, ReviewError
from flask import jsonify, make_response


def get_task_by_id_or_404(task_id):
    return Task.query.filter_by(id=task_id).first_or_404()


def get_task_data_from_request(request):
    """Extracts task json data from the request and returns it
    as a dict.
    """

    if not request.is_json:
        abort(400, "Expected JSON data.")
    if request.json.get("due_date"):
        data = dict({
            **request.json,
            "due_date": datetime.strptime(
                request.json.get("due_date"), '%Y-%m-%d').date()
        })
    else:
        data = dict(request.json)
    return data


def add_task_from_data(data: dict):
    try:
        task = Task(**data)
        db.session.add(task)
        db.session.commit()
    except (ValueError, TypeError) as e:
        db.session.rollback()
        abort(400, str(e))
    return task


def update_task_from_request(task_id, request):
    """Updates task with data from the request."""

    if not request.is_json or not request.json:
        abort(400, "Request should be in json format.")
    task_query = db.session.query(Task).filter(Task.id == task_id)
    if task_query.count() < 1:
        abort(404, f"Task with a given id: {task_id} was not found.")
    try:
        # Initially I thought I would reset intro_date from the UI,
        # it turned out later it is better to do it
        # on the server
        dates = {
            k: datetime.strptime(request.json[k], '%Y-%m-%d').date()
            for k in filter(lambda key: key in request.json,
                            {"intro_date", "due_date"})
        }
        task_data = {**request.json, **dates} if dates else request.json

        # remove id so it doesn't get modified in the db
        if task_data.get("id", None):
            del task_data["id"]

        # multiplier, title have to be checked by hand - query.update doesn't
        # run model fields validators
        if float(task_data.get("multiplier", 1.0)) < 1.0:
            raise ValueError("Task multiplier must be > 0.")
        if task_data.get("title", "title") == "":
            raise ValueError("Can not set title to an empty string.")
        try:
            task_query.update(task_data)
            db.session.commit()
        except InvalidRequestError as e:
            db.session.rollback()
            raise ValueError(str(e))
    except ValueError as e:
        abort(400, str(e))

    return task_query.first()


def tick_off_task_by_id(task_id):
    task = get_task_by_id_or_404(task_id)
    try:
        task.tick_off()
    except ReviewError:
        abort(400)
    return task


def delete_task_by_id_or_404(task_id):
    task = get_task_by_id_or_404(task_id)
    db.session.delete(task)
    db.session.commit()


def reset_task_by_id(task_id):
    task = get_task_by_id_or_404(task_id)
    task.reset()

    return task


def change_task_status_by_id(task_id):
    task = get_task_by_id_or_404(task_id)
    task.active = not task.active
    db.session.add(task)
    db.session.commit()

    return task


def add_task_from_request(request):
    task_data = get_task_data_from_request(request)
    task = add_task_from_data(task_data)

    return task


def jsonify_all_tasks():
    tasks = Task.query.all()

    return jsonify([task.to_dict() for task in tasks])


def get_all_tasks_as_response():
    return make_response(jsonify_all_tasks(), 200)


def make_response_from_updated_task(task_id, request, status_code=200):
    task = update_task_from_request(task_id, request)
    return make_response(task.to_dict(), status_code)
