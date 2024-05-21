# Django Messenger

Django Messenger is a chat application built with React and Django REST Framework. It enables users to have realtime one-to-one conversations.

## Lil bit About this app:
  * JWT Authentication
  * Django Channels for WebSocket Communication
  * User Relations
  * etc., 

## Preview

### Installation for Frontend

1. Clone the repository:

   ```bash
   git clone https://github.com/Abubakkar-Siddhiq/django_messenger.git
   ```

2. Navigate to the project directory:

   ```bash
   cd django_messenger/frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure Firebase:
    - Configure firebase as Said in this [Blog](https://blog.logrocket.com/firebase-cloud-storage-firebase-v9-react/)
    - And place the Firebase Credentials in a .env File
  
6. run the application in development mode, use the following command:
    ```bash
      npm run dev
    ```
This will start the development server, and you can access the application at [http://localhost:5173/](http://localhost:5173/)


### Installation for Backend

1. Navigate to the project directory:

   ```bash
   cd django_messenger/backend
   ```
2.  Install dependencies:
     ```bash
      pip install -r requirements.txt
     ```
3.  Migrate the DB:

    ```bash
     ~$ python manage.py makemigrations
    
     ~$ python manage.py migrate
    ```
4. Now start the server:
    ```bash
      python manage.py runserver
    ```
    This will start the development server, and you can access the application at [http://localhost:8000/](http://localhost:8000/)

