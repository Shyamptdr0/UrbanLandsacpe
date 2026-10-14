import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables from .env
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def main():
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'urban-landscape')
    admin_email = os.environ.get('ADMIN_EMAIL')

    if not mongo_url:
        print("Error: MONGO_URL environment variable is missing.")
        return

    if not admin_email:
        print("Error: ADMIN_EMAIL environment variable is missing.")
        return

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    user = await db.users.find_one({'email': admin_email})
    print(f"Admin record for '{admin_email}':", user)
    client.close()

if __name__ == '__main__':
    asyncio.run(main())
