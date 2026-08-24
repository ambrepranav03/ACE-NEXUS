from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/onboarding")
def onboarding():
    return render_template("onboarding.html")

@app.route("/onboarding2")
def onboarding2():
    return render_template("onboarding2.html")

@app.route("/onboarding3")
def onboarding3():
    return render_template("onboarding3.html")

if __name__ == "__main__":
    app.run(debug=True)