
from Flask import Flask, render_template_string
from stravalib.client import Client
import os
from datetime import datetime, timedelta

app = Flask(__name__)

# Strava API credentials
STRAVA_CLIENT_ID = os.environ.get('90376')
STRAVA_CLIENT_SECRET = os.environ.get('9a31b9066c2942feb97a9a3afb7e7f4d9f1da453')
STRAVA_REFRESH_TOKEN = os.environ.get('b130dda61ee534aec1d05b94d1d1c0257d547765')

# Initialize Strava client
client = Client()

def refresh_access_token():
    refresh_response = client.refresh_access_token(
        client_id=STRAVA_CLIENT_ID,
        client_secret=STRAVA_CLIENT_SECRET,
        refresh_token=STRAVA_REFRESH_TOKEN
    )
    client.access_token = refresh_response['access_token']
    client.refresh_token = refresh_response['refresh_token']
    client.token_expires_at = refresh_response['expires_at']

@app.route('/')
def index():
    refresh_access_token()
    
    # Get activities from the last 30 days
    activities = client.get_activities(after=datetime.utcnow() - timedelta(days=30))
    
    # Process activities
    activity_list = []
    for activity in activities:
        activity_list.append({
            'name': activity.name,
            'type': activity.type,
            'distance': f"{activity.distance.num:.2f} {activity.distance.unit}",
            'moving_time': str(activity.moving_time),
            'elevation_gain': f"{activity.total_elevation_gain:.2f} m",
            'start_date': activity.start_date.strftime('%Y-%m-%d %H:%M:%S')
        })

    # Render HTML template
    return render_template_string('''
        <html>
            <head>
                <title>My Strava Results</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                    h1 { color: #FC4C02; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #FC4C02; color: white; }
                </style>
            </head>
            <body>
                <h1>My Strava Results (Last 30 Days)</h1>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Distance</th>
                        <th>Moving Time</th>
                        <th>Elevation Gain</th>
                        <th>Start Date</th>
                    </tr>
                    {% for activity in activities %}
                    <tr>
                        <td>{{ activity.name }}</td>
                        <td>{{ activity.type }}</td>
                        <td>{{ activity.distance }}</td>
                        <td>{{ activity.moving_time }}</td>
                        <td>{{ activity.elevation_gain }}</td>
                        <td>{{ activity.start_date }}</td>
                    </tr>
                    {% endfor %}
                </table>
            </body>
        </html>
    ''', activities=activity_list)

if __name__ == '__main__':
    app.run(debug=True)

# Note: This script won't run here as it requires environment variables and Flask setup.
# Please set up your environment and run this script locally.

print("Strava Results App created successfully!")
print("To run this app:")
print("1. Install required packages: pip install flask stravalib")
print("2. Set your Strava API credentials as environment variables")
print("3. Run the script: python app.py")
print("4. Open a web browser and go to http://localhost:5000")