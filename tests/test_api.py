import unittest
import datetime
from flask import url_for
from app.fake import fake_tasks
from app.models import Task, ReviewData
from datetime import date
from app import create_app, db


class TestApi(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        self.client = self.app.test_client(use_cookies=True)

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_add_task(self):
        """Test adding task into the database."""

        task_data = {"title": "Read a book again",
                     "description": "John Kowolski. Title.",
                     "due_date": "2022-08-04",
                     "multiplier": 1.8}
        response = self.client.post("/v1/add-task", json=task_data)

        # the "Created" response code
        self.assertEqual(response.status_code, 201)

        # check if task has been created in a database
        task = Task.query.first()
        self.assertEqual(task.title, "Read a book again")
        self.assertEqual(task.multiplier, 1.8)

    def test_add_task_bad_request(self):
        """Test server response to the bad request in creating a task."""

        response = self.client.post("/v1/add-task",
                                    json={"occupation": "abbot"})
        self.assertEqual(response.status_code, 400)

    def test_get_tasks(self):
        """Test getting task list from the server."""

        tasks = fake_tasks()
        db.session.add_all(
            [Task(**{**task, "intro_date":
                     datetime.datetime.strptime(
                         task["intro_date"],
                         '%Y-%m-%d').date()}) for task in tasks])
        db.session.commit()

        response = self.client.get("/v1/tasks")
        tasks_titles = [resp_item["title"] for resp_item in response.json]

        self.assertEqual(len(tasks), len(list(response.json)))
        for task in tasks:
            self.assertTrue(task["title"] in tasks_titles)

    def test_update_multiplier(self):
        """Test updating task multiplier."""

        task = Task(**{"title": "Read a book again",
                       "description": "John Kowolski. Title.",
                       "multiplier": 1.8})
        db.session.add(task)
        db.session.commit()

        response = self.client.patch(f"/v1/tasks/{task.id}/multiplier/1.1")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(float(self.client.get(
            f"/v1/task/{task.id}").json["multiplier"]), 1.1)

    def test_update_description(self):
        """Test updating task description."""

        task = Task(**{"title": "Read a book again",
                       "description": "John Kowolski. First Title."})
        db.session.add(task)
        db.session.commit()

        response = self.client.patch(
            f"/v1/tasks/{task.id}/description",
            json={"description": "John Novak. Second Title."})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            self.client.get(f"/v1/task/{task.id}").json["description"],
            "John Novak. Second Title.")

    def test_update_due_date(self):
        """Test updating due date of a task."""

        task = Task(**{"title": "Read a book again",
                       "description": "John Kowolski. Title."})
        db.session.add(task)
        db.session.commit()

        new_date = task.due_date + datetime.timedelta(days=4)
        response = self.client.patch(url_for(
            'api_v1.update_due_date', task_id=task.id, due_date=new_date))
        self.assertEqual(response.status_code, 200)

        self.assertEqual(task.due_date, new_date)
        self.assertEqual(Task.query.first().due_date, new_date)

        # malformed date
        response = self.client.patch(
            f"/v1/tasks/{task.id}/update/1998-2-30")
        self.assertEqual(response.status_code, 404)

    def test_ticking_off(self):
        """Test 'ticking-off' reviewed tasks."""

        due_task_past = Task(**{
            "title": "task 1",
            "description": "Description 1",
            "intro_date": date(1999, 1, 1),
            "due_date": date(2000, 2, 2)})
        todays_task = Task(**{
            "title": "task 2",
            "description": "Description 2",
            "intro_date": datetime.date.today() - datetime.timedelta(days=3),
            "due_date": datetime.date.today()})
        future_task = Task(**{
            "title": "task 3",
            "description": "Description 3"})
        inactive_task = Task(**{
            "title": "task 1",
            "description": "Description 1",
            "active": False,
            "intro_date": datetime.date.today() - datetime.timedelta(days=3),
            "due_date": datetime.date.today()})

        db.session.add_all([due_task_past, todays_task,
                            future_task, inactive_task])
        db.session.commit()

        for task in due_task_past, todays_task:
            response = self.client.put(f"/v1/tasks/{task.id}/tick-off")
            self.assertEqual(response.status_code, 200)

        for task in future_task, inactive_task:
            response = self.client.put(f"/v1/tasks/{task.id}/tick-off")
            self.assertEqual(response.status_code, 400)

    def test_deleting_task(self):
        """Test deleting tasks from the database."""

        task = Task(title="Review book chapter",
                    intro_date=date(2022, 1, 1),
                    description="John Kowolski. Title. Chapter 1.",
                    reviews=[
                        ReviewData(reviewed_on=date(2022, 3, 17),
                                   prev_due_date=date(2022, 9, 1),
                                   multiplier=1.5),
                        ReviewData(reviewed_on=date(2022, 1, 31),
                                   prev_due_date=date(2022, 3, 17),
                                   multiplier=1.5)
                    ])
        db.session.add(task)
        db.session.commit()

        self.assertEqual(self.client.delete(
            url_for("api_v1.delete_task",
                    task_id=task.id)).status_code, 200)
        self.assertFalse(Task.query.all())
        self.assertFalse(ReviewData.query.all())

    def test_change_task_status(self):
        """Test removing/reintroducing task into queue."""
        task = Task(title="Review book chapter",
                    active=True,
                    description="John Kowolski. Title. Chapter 1.")
        db.session.add(task)
        db.session.commit()

        self.assertEqual(self.client.patch(
            url_for("api_v1.change_task_status",
                    task_id=task.id)).status_code, 200)
        self.assertFalse(Task.query.first().active)

        self.client.patch(url_for("api_v1.change_task_status",
                                  task_id=task.id))
        self.assertTrue(Task.query.first().active)
