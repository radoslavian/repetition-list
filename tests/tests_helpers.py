import unittest
from app import create_app, db
from app.utils.fake import fake_tasks, fake_task_for_api, fake_task
from app.models import Task


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
# Because some tests are repeating (between version 1 and v2. of the api
# I decided to delegate some of the tests into higher-order functions
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
        db.session.add(task)
        db.session.commit()

        response = self.client.get(route.format(task.id))

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.is_json)

        task_title = task.title
        task_title_from_response = response.json["title"]

        self.assertEqual(task_title, task_title_from_response)

    return test
