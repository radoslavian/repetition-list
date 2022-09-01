import unittest
from flask import current_app
from app import create_app, db
from app.models import Task, ReviewData
from datetime import date, timedelta


class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_app_exists(self):
        """Check if app exists."""

        self.assertFalse(self.app is None)

    def test_app_is_testing(self):
        """Check if app is running on testing configuration."""

        self.assertTrue(current_app.config['TESTING'])

    def test_task_model(self):
        """Test the Task database model."""

        db.session.add(Task(title="Review book chapter",
                            description="John Kowolski. Title. Chapter 1.",
                            multiplier=1.5))
        db.session.commit()
        task = Task.query.order_by().first()

        self.assertEqual(task.title, "Review book chapter")
        self.assertTrue(task.active)
        self.assertEqual(task.intro_date, date.today())
        self.assertEqual(task.due_date,
                         date.today() + timedelta(days=Task.default_interval))

    def test_new_due_date_calculator(self):
        """Test default review dates calculator."""
        # TODO: remove "magic" numbers

        db.session.add(Task(title="Review book chapter",
                            intro_date=date(2022, 1, 1),
                            due_date=date(2023, 1, 31),
                            description="John Kowolski. Title. Chapter 1.",
                            multiplier=1.5,
                            reviews=[
                                ReviewData(reviewed_on=date(2022, 1, 31),
                                           prev_due_date=date(2022, 3, 17),
                                           multiplier=1.5),
                                ReviewData(reviewed_on=date(2022, 3, 17),
                                           prev_due_date=date(2022, 9, 1),
                                           multiplier=1.5),
                                ReviewData(reviewed_on=date(2022, 3, 17),
                                           prev_due_date=date(2022, 5, 23),
                                           multiplier=1.5),
                            ]))
        db.session.commit()

        task = Task.query.order_by().first()
        self.assertEqual(
            date.today() + (date(2023, 1, 31) - date(2022, 9, 1)) * 1.5,
            task.new_due_date())

        task2 = Task(
            title="Review book chapter",
            intro_date=date(2022, 1, 1),
            due_date=date(2023, 1, 31),
            description="John Kowolski. Title. Chapter 1.",
            multiplier=2)
        db.session.add(task2)
        db.session.commit()

        self.assertEqual(
            date.today() + (date(2023, 1, 31)-date(2022, 1, 1)) * 2,
            task2.new_due_date())

    def test_review_data(self):
        task = Task(title="Review book chapter",
                    description="John Kowolski. Title. Chapter 1.",
                    multiplier=3,
                    due_date=date.today())
        db.session.add(task)
        db.session.commit()
        task.tick_off()

        review_data = ReviewData.query.order_by().first()

        self.assertEqual(review_data.task_id, task.id)
        self.assertEqual(review_data.task.title, task.title)
        self.assertEqual(review_data.reviewed_on, date.today())
        task.reviews = []
        db.session.add(task)
        db.session.commit()
        self.assertEqual(Task.query.first().reviews, [])
        self.assertEqual(ReviewData.query.all(), [])

    def test_task_repr(self):
        """Tests the __repr__ method of the Task model."""

        db.session.add(Task(title="Review book chapter"))
        db.session.commit()
        task = Task.query.first()
        self.assertEqual(repr(task), "<Review book chapter>")

    def test_zero_multiplier(self):
        """Test if the Task model accepts (should not) 0 multiplier."""

        self.assertRaises(ValueError,
                          lambda: Task(title="task", multiplier=0))

    def test_non_numerical_multiplier(self):
        """Test if the Task model accepts non numerical multiplier."""

        self.assertRaises(ValueError,
                          lambda: Task(title="task", multiplier="a"))

    def test_empty_title(self):
        """Test if Task title can be changed to an empty string."""

        def raise_error():
            db.session.add(Task(title="Review book chapter"))
            db.session.commit()
            task = Task.query.first()
            task.title = ""

        self.assertRaises(ValueError, raise_error)

    def test_new_review_date(self):
        """Test making new review date based on ReviewData.
        Method tested: Task.new_due_date
        """
        task = Task(title="task title",
                    intro_date=date(2022, 6, 15),
                    due_date=date(2022, 9, 3),
                    multiplier=2.0,
                    # three entries - only for illustration
                    # and possible future development
                    reviews=[
                        ReviewData(reviewed_on=date(2022, 6, 21),
                                   multiplier=2.0,
                                   prev_due_date=date(2022, 6, 20)),
                        ReviewData(reviewed_on=date(2022, 7, 3),
                                   multiplier=2.0,
                                   prev_due_date=date(2022, 7, 1)),
                        ReviewData(reviewed_on=date(2022, 7, 25),
                                   multiplier=2.0,
                                   prev_due_date=date(2022, 7, 23))
                    ])
        db.session.add(task)
        db.session.commit()
        self.assertEqual((task.new_due_date() - date.today()),
                         (date(2022, 9, 3) - date(2022, 7, 23)) * 2)
