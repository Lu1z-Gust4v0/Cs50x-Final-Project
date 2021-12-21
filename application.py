import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
from string import punctuation  # Special characters

from helpers import login_required, apology

app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///my_app.db")


@app.route("/")
def index():

    return render_template("index.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register User"""
    if request.method == "POST":

        # Getting the username from the register form
        Username = request.form.get("register-user").strip()
        isRepeated = db.execute("SELECT username FROM users WHERE username=?", Username)

        # Getting the passwords from the register form
        Password = request.form.get("register-password").strip()
        Confirmation = request.form.get("confirm-password").strip()

        # Getting the email from the register form
        email = request.form.get("register-email").strip()

        # Ensure username was typed and does not yet exist
        if not Username:
            flash("[Error] You must provide an username.")
            return render_template("register.html")

        elif isRepeated:
            flash("[Error] This username is already been used.")
            return render_template("register.html")

        # Ensure password was typed and the passwords match
        if not Password:
            flash("[Error] You must provide a password.")
            return render_template("register.html")

        if not Password == Confirmation:
            flash("[Error] The passwords must be equal.")
            return render_template("register.html")

        if len(Password) < 6:
            flash("[Error] Password must have 6 or more characters")
            return render_template("register.html")

        # Checking if it's a secure password
        special_characters = list(punctuation)  # special characters' list
        numbers = 0
        uppercase = 0
        special = 0

        for letter in Password:
            if letter.isnumeric():
                numbers += 1
            if letter.isupper():
                uppercase += 1
            if letter in special_characters:
                special += 1

        if numbers == 0:
            flash("[Error] Password must have one or more numbers")
            return render_template("register.html")

        if uppercase == 0:
            flash("[Error] Password must have one or more uppercase letters")
            return render_template("register.html")

        if special == 0:
            flash("[Error] Password must have one or more special characters")
            return render_template("register.html")

        if not email:
            flash("[Error] you must provide an email.")
            return render_template("register.html")

        counter = 0
        for letter in email:
            if letter == "@":
                counter += 1

        if counter != 1:
            flash("[Error] you must provide a valid email.")
            return render_template("register.html")

        # Generating a password hash
        Hash = generate_password_hash(Password)

        # Getting current time
        time = db.execute("SELECT CURRENT_TIMESTAMP")
        time = time[0]["CURRENT_TIMESTAMP"]

        # setting new user's ID
        ID = db.execute("SELECT COUNT(id) FROM users")
        ID = ID[0]["COUNT(id)"] + 1

        # Default picture
        picture = "/static/avatars/male_avatar.svg"

        # Creating a new user
        db.execute("INSERT INTO users (id, username, password, email, picture, creation_date) VALUES(?, ?, ?, ?, ?, ?)",
            ID, Username, Hash, email, picture, time)

        return redirect("/login")


    else:
        return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            flash("[ERROR] you must provide an username")
            return render_template("login.html")

        # Ensure password was submitted
        elif not request.form.get("password"):
            flash("[ERROR] you must provide a password")
            return render_template("login.html")

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username").strip())

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["password"], request.form.get("password").strip()):
            flash("[ERROR] invalid username and/or password")
            return render_template("login.html")

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/home")

    else:
        return render_template("login.html")


@app.route("/home")
@login_required
def home_page():

    # highlight current page in the navbar
    home = "current-page"
    return render_template("home.html",home=home)


@app.route("/learn")
@login_required
def learn():

    # highlight current page in the navbar
    learn = "current-page"
    return render_template("learn.html", learn=learn)


@app.route("/learn/articles/<title>")
@login_required
def articles(title):

    # highlight current page in the navbar
    learn = "current-page"
    articles = ["blockchain", "cryptocurrencies", "smartcontracts", "wallets", "webthree"]

    if not title:
        flash("[ERROR] missing article title")
        return redirect("/learn")

    if title in articles:
        return render_template(f"{title}.html", learn=learn)

    else:
        return redirect("/learn")


@app.route("/quiz", methods=["GET", "POST"])
@login_required
def quiz():

    # highlight current page in the navbar
    quiz = "current-page"

    if request.method == "POST":

        results = request.get_json()

        if not results:
            flash("[Error] results not found, please reload the page.")

        # setting quiz ID
        ID = db.execute("SELECT COUNT(id) FROM quiz")
        ID = ID[0]["COUNT(id)"] + 1

        # store quiz results into the database
        db.execute("INSERT INTO quiz (id, user_id, score, correct, incorrect, duration) VALUES(?,?,?,?,?,?)",
            ID, session["user_id"], results["score"], results["correct"], results["incorrect"], results["duration"])

        user_data = db.execute("SELECT * FROM users WHERE id=?", session["user_id"])[0]

        # set user highest score
        if not user_data["highest_score"]:
            db.execute("UPDATE users SET highest_score=? WHERE id=?", results["score"], session["user_id"])

        elif results["score"] >= user_data["highest_score"]:
            db.execute("UPDATE users SET highest_score=? WHERE id=?", results["score"], session["user_id"])

        # Find user's position
        leaderboard_data = db.execute("SELECT quiz.id, user_id, username, picture, score, duration FROM quiz JOIN users ON users.id WHERE users.id = quiz.user_id ORDER BY score DESC, duration")

        position = 0
        for i in range(0, len(leaderboard_data)):
            if leaderboard_data[i]["user_id"] == session["user_id"]:
                position = i + 1
                break

        # Update user's position
        db.execute("UPDATE users SET position=? WHERE id=?", position, session["user_id"])

        return {"response": 200}

    else:

        return render_template("quiz.html", quiz=quiz)


@app.route("/data")
@login_required
def data():

    # Answers of the quiz's questions

    quiz_answers = [
        "A", "C", "B", "D", "B",
        "C", "D", "A", "B", "A",
        "A", "D", "C", "D", "B",
        "B", "D", "A", "A", "C"]

    return jsonify(quiz_answers)


@app.route("/leaderboard")
@login_required
def leaderboard():

    # highlight current page in the navbar
    leaderboard = "current-page"

    leaderboard_data = db.execute("SELECT quiz.id, user_id, username, picture, score, duration FROM quiz JOIN users ON users.id WHERE users.id = quiz.user_id ORDER BY score DESC, duration")
    top_three_data = db.execute("SELECT username, picture, quiz.id, score, duration FROM quiz JOIN users ON users.id WHERE users.id = quiz.user_id ORDER BY score DESC, duration LIMIT 3")

    return render_template("leaderboard.html", leaderboard=leaderboard, leaderboard_data=leaderboard_data, top_three=top_three_data)


@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():

    # highlight current page in the navbar
    profile = "current-page"

    if request.method == "POST":

        data = request.get_json()

        if not data:
            flash("[Error] data not found.")

        if data["username"]:

            # ensure user doesn't chose a username already taken
            isRepeated = db.execute("SELECT username FROM users WHERE username=?", data["username"])

            if isRepeated:
                flash("[Error] This username is already been registered.")
                return {"response": 400}

            db.execute("UPDATE users SET username=? WHERE id=?", data["username"], session["user_id"])

        elif data["email"]:
            db.execute("UPDATE users SET email=? WHERE id=?", data["email"], session["user_id"])

        elif data["description"]:
            db.execute("UPDATE users SET description=? WHERE id=?", data["description"], session["user_id"])

        elif data["picture"]:
            db.execute("UPDATE users SET picture=? WHERE id=?", data["picture"], session["user_id"])

        return {"response": 200}

    else:
        user_data = db.execute("SELECT * FROM users WHERE id=?", session["user_id"])[0]
        quiz_data = db.execute("SELECT * FROM quiz WHERE user_id=? ORDER BY score DESC, duration", session["user_id"])

        return render_template("profile.html", profile=profile, user_data=user_data, quiz_data=quiz_data)


@app.route("/logout")
@login_required
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


def errorhandler(e):
    """Handle error"""
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return apology(e.name, e.code)


# Listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)