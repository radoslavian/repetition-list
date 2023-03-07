import datetime
import unittest
from datetime import date, timedelta

from app import create_app, db
from app.utils.fake import fake_tasks, fake_task_for_api, fake_task
from app.models import Task, ReviewData


class AppTester(unittest.TestCase):
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


def add_fake_tasks(number=10):
    """Adds fake tasks to testing database and returns
     a dictionary of tasks-data and references to task objects.
    """
    tasks_data = fake_tasks(number)
    tasks = [Task(**task) for task in tasks_data]
    db.session.add_all(tasks)
    db.session.commit()

    return tasks_data, tasks


def get_tasks_titles(response):
    return [resp_item["title"] for resp_item in response.json]


def route_ending(expected_route, obtained_route):
    """Cuts a domain name from the route returned from
    the url_for() - for routes comparison.
    """
    return obtained_route[-len(expected_route):]


# Higher-order functions for tests.
# Because some tests are repeating (between version 1 and v2. of the api)
# I decided to delegate some tests into higher-order functions
# which return methods to be used with different api endpoints.


def test_for_adding_task_with_invalid_fields(route: str):
    def test(self):
        """Test throwing error on other (than intro_date) invalid fields.
        """
        task_data = fake_task_for_api()
        task_data["invalid_field"] = "data for invalid field"
        response = self.client.post(route, json=task_data)
        self.assertEqual(response.status_code, 400)

    return test


def test_for_add_task_with_intro_date(route):
    def test(self):
        """Test throwing error on invalid field in a request
        - introduction date shall be added on the server side.
        """
        task_data = fake_task()
        response = self.client.post(route, json=task_data)

        self.assertEqual(response.status_code, 400)

    return test


def test_for_getting_task(route):
    def test(self):
        """Test getting task from server.
        """
        task_data = fake_task()
        task = Task(**task_data)
        task.save()

        response = self.client.get(route.format(task.id))

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.is_json)

        task_title = task.title
        task_title_from_response = response.json["title"]

        self.assertEqual(task_title, task_title_from_response)

    return test


def test_for_deleting_task(route):
    def test(self):
        """Test deleting task from the database."""
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
            route.format(task.id)).status_code, 204)
        self.assertFalse(Task.query.all())
        self.assertFalse(ReviewData.query.all())

    return test


def example_tasks():
    due_task_past = Task(**{
        "title": "task 1",
        "description": "Description 1",
        "intro_date": date(1999, 1, 1),
        "due_date": date(2000, 2, 2)})
    today_task = Task(**{
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
    db.session.add_all([due_task_past, today_task,
                        future_task, inactive_task])
    db.session.commit()
    return due_task_past, future_task, inactive_task, today_task


def test_for_resetting_task(route, method):
    def test(self):
        task, *_ = example_tasks()
        task.tick_off()

        self.assertEqual(len(task.reviews), 1)
        self.assertEqual(getattr(self.client, method)(
            route.format(task.id)).status_code, 200)
        self.assertEqual(len(task.reviews), 0)
        self.assertEqual(task.intro_date, date.today())
        self.assertEqual(task.due_date, date.today()
                         + timedelta(days=Task.default_interval))

    return test
