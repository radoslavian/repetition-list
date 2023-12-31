from app import db
from sqlalchemy import desc
from sqlalchemy.orm import validates
from datetime import date, timedelta
from sqlalchemy_serializer import SerializerMixin


class ReviewError(Exception):
    pass


def default_due_date():
    """Returns default due date (if not specified explicitly)
    for the Task model due_date field.
    """
    return date.today() + timedelta(days=Task.default_interval)


class Task(db.Model, SerializerMixin):
    __tablename__ = "tasks"
    default_interval = 3
    default_multiplier = 1.5

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    active = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text)
    intro_date = db.Column(db.Date, default=date.today)
    multiplier = db.Column(db.Float, default=lambda: Task.default_multiplier)
    due_date = db.Column(db.Date, default=default_due_date)

    @validates("multiplier")
    def validate_multiplier(self, key, value):
        """Check if multiplier is valid. If the test passes, validator method
        must return the multiplier value.
        """
        # raises ValueError if value can not be converted to float
        # for instance - it is an incompatible (non-numerical) string
        value = float(value)
        if value < 1.0:
            raise ValueError("Task multiplier must be > 1.")
        return value

    @validates("title")
    def validate_title(self, key, value):
        """Check if the title field isn't empty."""

        if not value:
            raise ValueError("Task title can not be an empty string.")
        return value

    def reset(self):
        self.reviews = []
        self.intro_date = date.today()
        self.due_date = default_due_date()

        self.save()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def new_due_date(self):
        """Calculates new due date."""

        if not self.reviews:
            review_span = self.due_date - self.intro_date
        else:
            # query that selects last review due_date
            # from rows sorted according to a date
            last_due_date = ReviewData.query.join(
                Task, ReviewData.task).filter(Task.id == self.id).order_by(
                    desc(ReviewData.prev_due_date)).first().prev_due_date
            review_span = self.due_date - last_due_date
        new_review_span = review_span * self.multiplier

        return date.today() + new_review_span

    def tick_off(self):
        if self.due_date > date.today():
            raise ReviewError("Can't tick-off task from the future.")
        elif not self.active:
            raise ReviewError("Can't tick-off an inactive task.")

        due_date = self.new_due_date()
        self.reviews.append(ReviewData(prev_due_date=self.due_date,
                                       reviewed_on=date.today(),
                                       multiplier=self.multiplier))
        self.due_date = due_date
        self.save()

    def __repr__(self):
        return "<" + self.title + ">"


class ReviewData(db.Model, SerializerMixin):
    __tablename__ = "review_data"
    serialize_rules = ("-task",)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                   nullable=False)
    task_id = db.Column(db.Integer,
                        db.ForeignKey("tasks.id", ondelete="CASCADE"),
                        nullable=False)
    reviewed_on = db.Column(db.Date, nullable=False)
    prev_due_date = db.Column(db.Date, nullable=False)
    multiplier = db.Column(db.Float, nullable=False)
    task = db.relationship("Task",
                           backref=db.backref("reviews",
                                              cascade="all, delete-orphan"))
