from app import db
from sqlalchemy import desc
from datetime import date, timedelta


class ReviewError(Exception):
    pass


class Task(db.Model):
    __tablename__ = "tasks"
    default_interval = 3
    default_multiplier = 1.5

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    active = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text)
    intro_date = db.Column(db.Date, default=date.today)
    multiplier = db.Column(db.Float, default=lambda: Task.default_multiplier)
    due_date = db.Column(db.Date, default=lambda: date.today() + timedelta(
        days=Task.default_interval))

    def new_due_date(self):
        """Calculates new due date."""

        if not self.reviews:
            review_span = self.due_date - self.intro_date
        else:
            # query that selects last review due_date
            # from rows sorted according to a date
            last_due_date = ReviewData.query.join(
                Task, ReviewData.task).order_by(
                    desc(ReviewData.prev_due_date)).first().prev_due_date
            review_span = self.due_date - last_due_date
        new_review_span = review_span * self.multiplier

        return date.today() + new_review_span

    def tick_off(self):
        if self.due_date > date.today():
            raise ReviewError("Can't tick-off task from the future.")
        elif not self.active:
            raise ReviewError("Can't tick-off an inactive task.")

        self.due_date = self.new_due_date()
        self.reviews.append(ReviewData(prev_due_date=self.due_date,
                                       reviewed_on=date.today(),
                                       multiplier=self.multiplier))
        db.session.add(self)
        db.session.commit()


class ReviewData(db.Model):
    __tablename__ = "review_data"
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
