from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    session,
    redirect,
    url_for
)
import sqlite3
import hashlib
import os
from datetime import datetime, timedelta
from functools import wraps


# =========================================================
# APP CONFIG
# =========================================================

app = Flask(__name__)

app.secret_key = os.environ.get(
    "ACE_SECRET_KEY",
    "ace-nexus-development-secret"
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.path.join(BASE_DIR, "database")
DATABASE = os.path.join(DATABASE_DIR, "ace_nexus.db")

os.makedirs(DATABASE_DIR, exist_ok=True)


# =========================================================
# DATABASE
# =========================================================

def get_db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():

    db = get_db()

    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'student',
            city TEXT DEFAULT '',
            skills TEXT DEFAULT '',
            goals TEXT DEFAULT '',
            bio TEXT DEFAULT '',
            experience_level TEXT DEFAULT '',
            organization_name TEXT DEFAULT '',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    db.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            opportunity_id INTEGER NOT NULL,
            status TEXT DEFAULT 'Applied',
            applied_on TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, opportunity_id)
        )
    """)

    db.execute("""
        CREATE TABLE IF NOT EXISTS saved_opportunities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            opportunity_id INTEGER NOT NULL,
            saved_on TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, opportunity_id)
        )
    """)

    db.execute("""
        CREATE TABLE IF NOT EXISTS organizer_opportunities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            organizer_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            type TEXT DEFAULT 'Hackathon',
            location TEXT DEFAULT 'India',
            mode TEXT DEFAULT 'offline',
            deadline TEXT DEFAULT '',
            reward TEXT DEFAULT '',
            description TEXT DEFAULT '',
            tags TEXT DEFAULT '',
            status TEXT DEFAULT 'Published',
            views INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    db.commit()
    db.close()


init_db()


# =========================================================
# DEMO OPPORTUNITIES
# =========================================================

DEMO_OPPORTUNITIES = [

    {
        "id": 1,
        "title": "AI Innovation Challenge",
        "type": "Hackathon",
        "location": "Bengaluru",
        "mode": "offline",
        "deadline": "12 days",
        "prize": "₹75,000",
        "description": "Build innovative AI solutions for real-world problems.",
        "tags": [
            "AI",
            "Python",
            "Hackathon"
        ],
        "match": 94
    },

    {
        "id": 2,
        "title": "Applied Machine Learning Lab",
        "type": "Workshop",
        "location": "Online",
        "mode": "online",
        "deadline": "5 days",
        "prize": "Certificate",
        "description": "Hands-on machine learning workshop covering practical AI workflows.",
        "tags": [
            "ML",
            "AI",
            "Workshop"
        ],
        "match": 89
    },

    {
        "id": 3,
        "title": "Smart India Hackathon",
        "type": "Hackathon",
        "location": "Pan India",
        "mode": "offline",
        "deadline": "18 days",
        "prize": "National Level",
        "description": "Solve real-world problem statements through innovation and technology.",
        "tags": [
            "AI",
            "Innovation",
            "Engineering"
        ],
        "match": 86
    },

    {
        "id": 4,
        "title": "Mumbai TechSprint",
        "type": "Hackathon",
        "location": "Mumbai",
        "mode": "offline",
        "deadline": "9 days",
        "prize": "₹50,000",
        "description": "A fast-paced technology sprint for student developers and innovators.",
        "tags": [
            "Development",
            "Python",
            "Innovation"
        ],
        "match": 91
    },

    {
        "id": 5,
        "title": "Delhi AI Builders",
        "type": "Competition",
        "location": "Delhi",
        "mode": "offline",
        "deadline": "15 days",
        "prize": "₹60,000",
        "description": "Create next-generation AI applications and compete with student builders.",
        "tags": [
            "AI",
            "Machine Learning",
            "Competition"
        ],
        "match": 88
    },

    {
        "id": 6,
        "title": "Hyderabad Developer Week",
        "type": "Workshop",
        "location": "Hyderabad",
        "mode": "offline",
        "deadline": "7 days",
        "prize": "Certificate",
        "description": "Explore modern development technologies through practical sessions.",
        "tags": [
            "Development",
            "Networking",
            "Learning"
        ],
        "match": 84
    },

    {
        "id": 7,
        "title": "Chennai Robotics Challenge",
        "type": "Competition",
        "location": "Chennai",
        "mode": "offline",
        "deadline": "21 days",
        "prize": "₹80,000",
        "description": "Design and build intelligent robotic systems for challenging scenarios.",
        "tags": [
            "Robotics",
            "Engineering",
            "Innovation"
        ],
        "match": 82
    },

    {
        "id": 8,
        "title": "Kolkata Innovation Sprint",
        "type": "Hackathon",
        "location": "Kolkata",
        "mode": "offline",
        "deadline": "11 days",
        "prize": "₹40,000",
        "description": "Build creative technology solutions and turn ideas into working prototypes.",
        "tags": [
            "Innovation",
            "Projects",
            "Hackathon"
        ],
        "match": 80
    }

]


# =========================================================
# HELPERS
# =========================================================

def hash_password(password):
    return hashlib.sha256(
        password.encode("utf-8")
    ).hexdigest()


def current_user():

    user_id = session.get("user_id")

    if not user_id:
        return None

    db = get_db()

    user = db.execute(
        "SELECT * FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()

    db.close()

    return dict(user) if user else None


def login_required(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        if not current_user():
            return redirect(url_for("login"))

        return function(*args, **kwargs)

    return wrapper


def api_login_required(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        user = current_user()

        if not user:
            return jsonify({
                "success": False,
                "error": "Authentication required"
            }), 401

        return function(*args, **kwargs)

    return wrapper


def find_opportunity(opportunity_id):

    for opportunity in DEMO_OPPORTUNITIES:

        if opportunity["id"] == opportunity_id:
            return opportunity.copy()

    db = get_db()

    row = db.execute("""
        SELECT *
        FROM organizer_opportunities
        WHERE id = ?
    """, (opportunity_id,)).fetchone()

    db.close()

    if not row:
        return None

    opportunity = dict(row)

    opportunity["tags"] = [
        tag.strip()
        for tag in opportunity.get("tags", "").split(",")
        if tag.strip()
    ]

    opportunity["prize"] = opportunity.get(
        "reward",
        ""
    )

    opportunity["match"] = 75

    return opportunity


def normalize_list(value):

    if isinstance(value, list):
        return [
            str(item).strip()
            for item in value
            if str(item).strip()
        ]

    if not value:
        return []

    return [
        item.strip()
        for item in str(value).split(",")
        if item.strip()
    ]


# =========================================================
# PUBLIC PAGE ROUTES
# =========================================================
# These pages are intentionally public so they can be
# opened directly for screenshots/demo presentation.
# =========================================================

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/student-login")
def student_login():
    return render_template("student_login.html")


@app.route("/organizer-login")
def organizer_login():
    return render_template("organizer_login.html")


@app.route("/student-register")
def student_register():
    return render_template("student_register.html")


@app.route("/organizer-register")
def organizer_register():
    return render_template("organizer_register.html")


@app.route("/onboarding")
def onboarding():
    return render_template("onboarding.html")


@app.route("/onboarding2")
def onboarding2():
    return render_template("onboarding2.html")


@app.route("/onboarding3")
def onboarding3():
    return render_template("onboarding3.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/organizer-dashboard")
def organizer_dashboard():
    return render_template("organizer_dashboard.html")


@app.route("/opportunity/<int:opportunity_id>")
def opportunity_page(opportunity_id):

    opportunity = find_opportunity(
        opportunity_id
    )

    if not opportunity:
        return render_template(
            "opportunity.html",
            opportunity_id=opportunity_id
        )

    return render_template(
        "opportunity.html",
        opportunity_id=opportunity_id
    )


# =========================================================
# REGISTER API
# =========================================================

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json(
        silent=True
    ) or request.form.to_dict()

    name = (
        data.get("name")
        or data.get("fullName")
        or "Student"
    ).strip()

    email = (
        data.get("email")
        or ""
    ).strip().lower()

    password = (
        data.get("password")
        or ""
    )

    role = (
        data.get("role")
        or "student"
    ).strip().lower()

    if not email or not password:

        return jsonify({
            "success": False,
            "error": "Email and password are required"
        }), 400

    if role not in [
        "student",
        "organizer"
    ]:
        role = "student"

    db = get_db()

    existing = db.execute(
        "SELECT id FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    if existing:

        db.close()

        return jsonify({
            "success": False,
            "error": "An account with this email already exists"
        }), 409

    db.execute("""
        INSERT INTO users (
            name,
            email,
            password,
            role,
            city,
            skills,
            goals,
            bio,
            experience_level,
            organization_name
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        name,
        email,
        hash_password(password),
        role,
        data.get("city", ""),
        data.get("skills", ""),
        data.get("goals", ""),
        data.get("bio", ""),
        data.get("experience_level", ""),
        data.get("organization_name", "")
    ))

    db.commit()

    user = db.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    db.close()

    session["user_id"] = user["id"]

    return jsonify({
        "success": True,
        "message": "Registration successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    })


# =========================================================
# LOGIN API
# =========================================================

@app.route("/api/login", methods=["POST"])
def api_login():

    data = request.get_json(
        silent=True
    ) or request.form.to_dict()

    email = (
        data.get("email")
        or ""
    ).strip().lower()

    password = (
        data.get("password")
        or ""
    )

    db = get_db()

    user = db.execute("""
        SELECT *
        FROM users
        WHERE email = ?
    """, (email,)).fetchone()

    db.close()

    if not user:

        return jsonify({
            "success": False,
            "error": "Invalid email or password"
        }), 401

    if user["password"] != hash_password(password):

        return jsonify({
            "success": False,
            "error": "Invalid email or password"
        }), 401

    session["user_id"] = user["id"]

    return jsonify({
        "success": True,
        "message": "Login successful",
        "redirect": (
            "/organizer-dashboard"
            if user["role"] == "organizer"
            else "/dashboard"
        ),
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    })


# =========================================================
# LOGOUT
# =========================================================

@app.route("/logout")
def logout():

    session.clear()

    return redirect(
        url_for("index")
    )


# =========================================================
# CURRENT USER
# =========================================================

@app.route("/api/me")
def api_me():

    user = current_user()

    if not user:

        return jsonify({
            "success": False,
            "authenticated": False
        })

    return jsonify({
        "success": True,
        "authenticated": True,
        "user": user
    })


# =========================================================
# OPPORTUNITIES
# =========================================================

@app.route("/api/opportunities")
def opportunities():

    result = [
        opportunity.copy()
        for opportunity in DEMO_OPPORTUNITIES
    ]

    db = get_db()

    organizer_rows = db.execute("""
        SELECT *
        FROM organizer_opportunities
        WHERE status != 'Draft'
        ORDER BY created_at DESC
    """).fetchall()

    db.close()

    for row in organizer_rows:

        opportunity = dict(row)

        opportunity["tags"] = normalize_list(
            opportunity.get("tags", "")
        )

        opportunity["prize"] = opportunity.get(
            "reward",
            ""
        )

        opportunity["match"] = 75

        result.append(opportunity)

    return jsonify({
        "success": True,
        "opportunities": result
    })


# =========================================================
# SINGLE OPPORTUNITY
# =========================================================

@app.route("/api/opportunities/<int:opportunity_id>")
def opportunity_api(opportunity_id):

    opportunity = find_opportunity(
        opportunity_id
    )

    if not opportunity:

        return jsonify({
            "success": False,
            "error": "Opportunity not found"
        }), 404

    if opportunity_id > 8:

        db = get_db()

        db.execute("""
            UPDATE organizer_opportunities
            SET views = views + 1
            WHERE id = ?
        """, (opportunity_id,))

        db.commit()
        db.close()

    return jsonify({
        "success": True,
        "opportunity": opportunity
    })


# =========================================================
# SEARCH
# =========================================================

@app.route("/api/search")
def search():

    query = (
        request.args.get("q", "")
        .strip()
        .lower()
    )

    if not query:

        return jsonify({
            "success": True,
            "results": DEMO_OPPORTUNITIES
        })

    results = []

    for opportunity in DEMO_OPPORTUNITIES:

        searchable = " ".join([
            opportunity["title"],
            opportunity["type"],
            opportunity["location"],
            opportunity["description"],
            " ".join(opportunity["tags"])
        ]).lower()

        if query in searchable:
            results.append(
                opportunity.copy()
            )

    return jsonify({
        "success": True,
        "results": results
    })


# =========================================================
# SAVED
# =========================================================

@app.route("/api/saved", methods=["GET"])
@api_login_required
def get_saved():

    user = current_user()

    db = get_db()

    rows = db.execute("""
        SELECT opportunity_id
        FROM saved_opportunities
        WHERE user_id = ?
        ORDER BY saved_on DESC
    """, (user["id"],)).fetchall()

    db.close()

    result = []

    for row in rows:

        opportunity = find_opportunity(
            row["opportunity_id"]
        )

        if opportunity:
            result.append(opportunity)

    return jsonify({
        "success": True,
        "saved": result
    })


@app.route(
    "/api/saved/<int:opportunity_id>",
    methods=["POST", "DELETE"]
)
@api_login_required
def saved_opportunity(opportunity_id):

    user = current_user()

    db = get_db()

    if request.method == "POST":

        db.execute("""
            INSERT OR IGNORE INTO saved_opportunities (
                user_id,
                opportunity_id
            )
            VALUES (?, ?)
        """, (
            user["id"],
            opportunity_id
        ))

        db.commit()
        db.close()

        return jsonify({
            "success": True,
            "saved": True
        })

    db.execute("""
        DELETE FROM saved_opportunities
        WHERE user_id = ?
        AND opportunity_id = ?
    """, (
        user["id"],
        opportunity_id
    ))

    db.commit()
    db.close()

    return jsonify({
        "success": True,
        "saved": False
    })


# =========================================================
# APPLICATIONS
# =========================================================

@app.route("/api/applications")
@api_login_required
def get_applications():

    user = current_user()

    db = get_db()

    rows = db.execute("""
        SELECT *
        FROM applications
        WHERE user_id = ?
        ORDER BY applied_on DESC
    """, (user["id"],)).fetchall()

    db.close()

    applications = []

    for row in rows:

        opportunity = find_opportunity(
            row["opportunity_id"]
        )

        if opportunity:

            opportunity["status"] = row["status"]
            opportunity["appliedOn"] = row["applied_on"]

            applications.append(
                opportunity
            )

    return jsonify({
        "success": True,
        "applications": applications
    })


@app.route(
    "/api/applications/<int:opportunity_id>",
    methods=["POST"]
)
@api_login_required
def apply(opportunity_id):

    user = current_user()

    opportunity = find_opportunity(
        opportunity_id
    )

    if not opportunity:

        return jsonify({
            "success": False,
            "error": "Opportunity not found"
        }), 404

    db = get_db()

    db.execute("""
        INSERT OR IGNORE INTO applications (
            user_id,
            opportunity_id,
            status
        )
        VALUES (?, ?, ?)
    """, (
        user["id"],
        opportunity_id,
        "Applied"
    ))

    db.commit()
    db.close()

    return jsonify({
        "success": True,
        "message": "Application submitted",
        "status": "Applied"
    })


# =========================================================
# PROFILE
# =========================================================

@app.route(
    "/api/profile",
    methods=["GET", "POST"]
)
@api_login_required
def profile():

    user = current_user()

    db = get_db()

    if request.method == "GET":

        db.close()

        return jsonify({
            "success": True,
            "profile": user
        })

    data = request.get_json(
        silent=True
    ) or {}

    allowed = [
        "name",
        "city",
        "skills",
        "goals",
        "bio",
        "experience_level",
        "organization_name"
    ]

    fields = []
    values = []

    for field in allowed:

        if field in data:

            fields.append(
                f"{field} = ?"
            )

            values.append(
                data[field]
            )

    if fields:

        values.append(
            user["id"]
        )

        db.execute(
            f"""
            UPDATE users
            SET {", ".join(fields)}
            WHERE id = ?
            """,
            values
        )

        db.commit()

    updated = db.execute(
        "SELECT * FROM users WHERE id = ?",
        (user["id"],)
    ).fetchone()

    db.close()

    return jsonify({
        "success": True,
        "profile": dict(updated)
    })


# =========================================================
# PERSONALIZED OPPORTUNITIES
# =========================================================

@app.route("/api/personalized")
def personalized():

    user = current_user()

    if not user:

        return jsonify({
            "success": True,
            "opportunities": DEMO_OPPORTUNITIES
        })

    skills = [
        item.lower()
        for item in normalize_list(
            user.get("skills", "")
        )
    ]

    goals = [
        item.lower()
        for item in normalize_list(
            user.get("goals", "")
        )
    ]

    city = (
        user.get("city", "")
        or ""
    ).lower()

    results = []

    for original in DEMO_OPPORTUNITIES:

        opportunity = original.copy()

        score = opportunity["match"]

        tags = [
            tag.lower()
            for tag in opportunity["tags"]
        ]

        for skill in skills:

            if any(
                skill in tag
                or tag in skill
                for tag in tags
            ):
                score += 4

        for goal in goals:

            searchable_goals = (
                opportunity["title"]
                + " "
                + opportunity["type"]
                + " "
                + opportunity["description"]
            ).lower()

            if goal in searchable_goals:

                score += 5

        if city and city in opportunity["location"].lower():
            score += 3

        if opportunity["mode"] == "online":
            score += 1

        opportunity["personalizedMatch"] = min(
            score,
            99
        )

        results.append(
            opportunity
        )

    results.sort(
        key=lambda item: item["personalizedMatch"],
        reverse=True
    )

    return jsonify({
        "success": True,
        "opportunities": results
    })


# =========================================================
# ACE AI
# =========================================================

@app.route("/api/ai", methods=["POST"])
def ace_ai():

    data = request.get_json(
        silent=True
    ) or {}

    message = (
        data.get("message")
        or data.get("prompt")
        or ""
    ).strip().lower()

    if "hackathon" in message:

        response = (
            "Based on the current ACE NEXUS opportunities, "
            "AI Innovation Challenge, Mumbai TechSprint and "
            "Smart India Hackathon are available."
        )

    elif "skill" in message:

        response = (
            "Your ACE profile uses your skills and goals "
            "to personalize opportunity matching."
        )

    elif (
        "next" in message
        or "should i do" in message
    ):

        response = (
            "Start by completing your profile, then explore "
            "the opportunities with the highest profile match."
        )

    elif "profile" in message:

        response = (
            "Keep your skills, goals, experience level and "
            "career interests updated so ACE can personalize "
            "your discovery feed."
        )

    else:

        response = (
            "I'm ACE. I can help you explore hackathons, "
            "internships, competitions, workshops and "
            "other opportunities."
        )

    return jsonify({
        "success": True,
        "response": response
    })


# =========================================================
# ORGANIZER OPPORTUNITIES
# =========================================================

@app.route(
    "/api/organizer/opportunities",
    methods=["GET", "POST"]
)
@api_login_required
def organizer_opportunities():

    user = current_user()

    if user["role"] != "organizer":

        return jsonify({
            "success": False,
            "error": "Organizer access required"
        }), 403

    db = get_db()

    if request.method == "GET":

        rows = db.execute("""
            SELECT *
            FROM organizer_opportunities
            WHERE organizer_id = ?
            ORDER BY created_at DESC
        """, (
            user["id"],
        )).fetchall()

        db.close()

        opportunities = []

        for row in rows:

            item = dict(row)

            item["tags"] = normalize_list(
                item.get("tags", "")
            )

            item["prize"] = item.get(
                "reward",
                ""
            )

            item["match"] = 75

            opportunities.append(
                item
            )

        return jsonify({
            "success": True,
            "opportunities": opportunities
        })

    data = request.get_json(
        silent=True
    ) or {}

    title = (
        data.get("title")
        or ""
    ).strip()

    if not title:

        db.close()

        return jsonify({
            "success": False,
            "error": "Opportunity title is required"
        }), 400

    db.execute("""
        INSERT INTO organizer_opportunities (
            organizer_id,
            title,
            type,
            location,
            mode,
            deadline,
            reward,
            description,
            tags,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user["id"],
        title,
        data.get("type", "Hackathon"),
        data.get("location", "India"),
        data.get("mode", "offline"),
        data.get("deadline", ""),
        data.get("reward", ""),
        data.get("description", ""),
        data.get("tags", ""),
        data.get("status", "Published")
    ))

    db.commit()

    new_id = db.execute(
        "SELECT last_insert_rowid()"
    ).fetchone()[0]

    db.close()

    return jsonify({
        "success": True,
        "message": "Opportunity created",
        "id": new_id
    })


# =========================================================
# DELETE ORGANIZER OPPORTUNITY
# =========================================================

@app.route(
    "/api/organizer/opportunities/<int:opportunity_id>",
    methods=["DELETE"]
)
@api_login_required
def delete_organizer_opportunity(
    opportunity_id
):

    user = current_user()

    if user["role"] != "organizer":

        return jsonify({
            "success": False,
            "error": "Organizer access required"
        }), 403

    db = get_db()

    db.execute("""
        DELETE FROM organizer_opportunities
        WHERE id = ?
        AND organizer_id = ?
    """, (
        opportunity_id,
        user["id"]
    ))

    db.commit()
    db.close()

    return jsonify({
        "success": True,
        "message": "Opportunity deleted"
    })


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/api/health")
def health():

    return jsonify({
        "success": True,
        "status": "ACE NEXUS is running"
    })


# =========================================================
# ERROR HANDLERS
# =========================================================

@app.errorhandler(404)
def not_found(error):

    if request.path.startswith("/api/"):

        return jsonify({
            "success": False,
            "error": "API endpoint not found"
        }), 404

    return """
        <h1>ACE NEXUS — Page Not Found</h1>
        <p>The requested page does not exist.</p>
    """, 404


@app.errorhandler(500)
def server_error(error):

    if request.path.startswith("/api/"):

        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

    return """
        <h1>ACE NEXUS — Server Error</h1>
        <p>Please check the Flask terminal.</p>
    """, 500


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    print("")
    print("==========================================")
    print("        ACE NEXUS IS RUNNING")
    print("==========================================")
    print("")
    print("Landing:")
    print("http://127.0.0.1:5000/")
    print("")
    print("Student Dashboard:")
    print("http://127.0.0.1:5000/dashboard")
    print("")
    print("Organizer Dashboard:")
    print("http://127.0.0.1:5000/organizer-dashboard")
    print("")
    print("Onboarding:")
    print("http://127.0.0.1:5000/onboarding")
    print("http://127.0.0.1:5000/onboarding2")
    print("http://127.0.0.1:5000/onboarding3")
    print("")
    print("==========================================")
    print("")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )