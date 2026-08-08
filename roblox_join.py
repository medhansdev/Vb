import requests

# Paste your complete .ROBLOSECURITY cookie string here
ROBLOX_BOT_1_TOKEN = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEQAhoEEAQYASIbCgRkdWlkEhMxNDU1MjQ4MjI1OTA1MDAwMjE5IhQKBXVuYW1lEgtpdHptZXZvaWR6MSISCgN1aWQSCzExNDQ0ODg4MDc0KAM.z_xySDSYCLSB4TKApHnKkG_YuvmGeN5FrqiQCLeFbwvGyFgrdSEXJTHawqvpx-Or_VO5aHcONq0UN0qb5apm_iqMfOvtueuKwPK70O9vOx34M9FZCSAntF7yY6wc9dfI5yeh-uiiGJojp3JdbC3WB1LZiYyY2CpnYUEelvR2AHCxuidTPnzxBgqUxTM3jW-1P_FfqAwKG56N-OApkp8C0H0S5X7Wq0xi8ruzWSpn6qFqQCWJ6vMgnFpyizjotkWvOetc0YJRj9VUNsVyl0EhnD3BvSbVQNrzcmk0ynNeZK7VvLqvE0cULrPrD0lwPm6p4ZdubU2YssmIIADxGkMQQlWE3M3lL3gUGfq4NmX8TKs1a_89BF37vS3FdKRN-LMXGbtUYvKLGy0xtrO7kLHYmWSMCt25tP8DuPbVH-V0A11eIM7Rkb8hSRpKSeILaCV6P4Gsp3W1kDoK6W90YnJt3-yOTv4P-AzErRUB9arD2mdR-R8yPLY1IyqPqy_LtTdp5BNROcTFEv0OIkRX7hWp4DS68MbnqCb9DGEWHCv_F1ZuRYoWu481dZPlUJRCq9Rs9DLC124k5NV7_oLvSJo08YK6biJU9hUN-7PLlEswgfQr6f7xSpEuVTHvSEJcN1mgGsHAv-PPghNUdM2Z0KbHa07z4_50afw76noGhdniZCPjcgHiVWVlNgl6FenrH8TdfTh3JUNqjsPA37_KN8UbpsHZs9vq4TXo1EHuc2EjEaS-i9oj2vzTUHTnCU2NIV1GDcZKXq6z9YbEhn3agmtcifuRZKxchUJQW4LUw-TlCzH1weGWRTwktqRA0qBGWkhj8RiDhhCn5HQfkBL5zRlMUH3WNmbNHJD7-CteTri0fw7qMIFzUf-qQFxzsw9ktHcq1kt6kN6OR3DeU7hC4e6bRQ.zXpjp-dOxdgtabkoDt86QzVHuL4"

# Target Game Place ID (Change this to the game you want to join)
PLACE_ID = 1818  # Example: Classic Baseplate

def authenticate_and_launch():
    # Setup session with headers and cookie
    session = requests.Session()
    session.cookies[".ROBLOSECURITY"] = ROBLOX_COOKIE
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://www.roblox.com/"
    }

    print("[*] Authenticating with Roblox...")

    # 1. Verify Authentication & Get User Info
    user_res = session.get("https://users.roblox.com/v1/users/authenticated", headers=headers)
    
    if user_res.status_code != 200:
        print("[!] Authentication Failed! Check if your cookie is fresh, valid, and unexpired.")
        return

    user_data = user_res.json()
    user_id = user_data.get("id")
    username = user_data.get("name")
    print(f"[+] Successfully logged in as: {username} (ID: {user_id})")

    # 2. Get CSRF Token (Required for executing game actions via POST requests)
    csrf_res = session.post("https://auth.roblox.com/v1/logout", headers=headers)
    csrf_token = csrf_res.headers.get("X-CSRF-TOKEN")
    
    if csrf_token:
        headers["X-CSRF-TOKEN"] = csrf_token

    print(f"[*] Fetching game server instances for Place ID: {PLACE_ID}...")

    # 3. Fetch active game servers (Game Instances)
    servers_url = f"https://games.roblox.com/v1/games/{PLACE_ID}/servers/Public?limit=10"
    servers_res = session.get(servers_url, headers=headers)

    if servers_res.status_code == 200:
        servers_data = servers_res.json().get("data", [])
        if servers_data:
            # Pick the first available server
            server_job_id = servers_data[0]["id"]
            print(f"[+] Found active server Job ID: {server_job_id}")
            print(f"[+] Ready to join! Game link format: roblox://experiences/start?placeId={PLACE_ID}&gameInstanceId={server_job_id}")
        else:
            print("[!] No active public servers found for this game.")
    else:
        print(f"[!] Failed to fetch game servers. Status code: {servers_res.status_code}")

if __name__ == "__main__":
    authenticate_and_launch()