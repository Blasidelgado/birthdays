import os

from cs50 import SQL
from flask import Flask, redirect, render_template, request


from helpers import validate_data

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///birthdays.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/", methods=["GET", "POST", "PUT", "DELETE"])
def index():
    # User accesed via GET
    if request.method == "GET":
        bdays = db.execute("SELECT * FROM birthdays;")
        return render_template("index.html", bdays=bdays)

    # User is creating a new row
    if request.method == "POST":

        # Validate provided information before creating in db
        if (validate_data(request.form.get('name'),
                        request.form.get('month'),
                        request.form.get('day'))):

            # Create in db
            db.execute("""
                INSERT INTO birthdays (name, month, day)
                VALUES (?, ?, ?);""",
                request.form.get('name'),
                request.form.get('month'),
                request.form.get('day'))

        return redirect("/")

    # User is updating info from a row
    if request.method == "PUT":

        # Validate provided information before creating in db
        if (validate_data(request.form.get('name'),
                        request.form.get('month'),
                        request.form.get('day'))):
                # Get which row the user is updating
                id = int(request.form.get('id'))

                # Update provided info in database
                db.execute("""UPDATE birthdays
                        SET name = ?, month = ?, day = ?
                        WHERE id = ?;""",
                        request.form.get('name'),
                        request.form.get('month'),
                        request.form.get('day'),
                        id)

                return redirect("/"), 200

        else:
                return redirect("/"), 400

    # User is deleting a row
    if request.method == "DELETE":
        try:
            # Get which row the user is deleting
            id = int(request.form.get('id'))

            # Delete row from database
            db.execute("""DELETE FROM birthdays
                    WHERE id = ?;""", id)

        except:
            return redirect("/"), 400

        return redirect("/"), 200
