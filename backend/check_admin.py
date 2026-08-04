import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb+srv://shyam8patidar_db_user:lOaZjJWZpyS3iQUz@cluster0.7cbbymr.mongodb.net/?appName=Cluster0')
    db = client['urban-landscape']
    user = await db.users.find_one({'email': 'admin@urbanlandscape.in'})
    print(user)

asyncio.run(main())
