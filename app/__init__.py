from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config
from app.converters import DateConverter

db = SQLAlchemy()


def create_app(config_name="development"):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    db.init_app(app)
    app.url_map.converters['date'] = DateConverter

    from .api_v1 import api_v1 as api_v1_blueprint
    app.register_blueprint(api_v1_blueprint)

    if "sqlite" in app.config["SQLALCHEMY_DATABASE_URI"]:
        def _fk_pragma_on_connect(dbapi_con, con_record):
            """Turns on ForeignKey constraint on each connection
            when using SQLite.
            https://gist.github.com/asyd/a7aadcf07a66035ac15d284aef10d458
            """
            dbapi_con.execute("pragma foreign_keys=ON")

        with app.app_context():
            from sqlalchemy import event
            event.listen(db.engine, "connect", _fk_pragma_on_connect)

    return app
