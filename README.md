# Django Messenger 🌨️

Django Messenger is a chat application built with React and Django REST Framework. It enables users to have realtime one-to-one conversations.

## Lil bit About this app:
  * JWT Authentication
  * Django Channels for WebSocket Communication
  * User Relations
  * Zustand for State management
  * Realtime Chat updates and Notifications
  * etc., 

## Preview
   * The Main Layout (Chat Area)
     ![image](https://github.com/Abubakkar-Siddhiq/django_messenger/assets/148426945/74f59b51-b67e-4859-a91f-b12861fe3fa5)
     ![image](https://github.com/Abubakkar-Siddhiq/django_messenger/assets/148426945/8c4aedf3-2b80-4893-8517-514c9f284930)

   * User Detial
    ![image](https://github.com/Abubakkar-Siddhiq/django_messenger/assets/148426945/4f1a5570-810a-4e06-bf5c-8be214e23026)


   * Is Typing? Indicator
     ![image](https://github.com/Abubakkar-Siddhiq/django_messenger/assets/148426945/cad5da43-735c-4d8e-a817-8386996da07f)
   
   * Real-Time Chat Notifications
     ![image](https://github.com/Abubakkar-Siddhiq/django_messenger/assets/148426945/3163db75-0631-42ea-9887-e4ad823b6ae7)


   * Search for other users, And add them as your Freind!
     ![image](https://github.com/Abubakkar-Siddhiq/django_messenger/assets/148426945/0d0b7013-3c82-4141-9ec2-bfb382740b25)

   * Edit your Profile!
     ![image](https://github.com/Abubakkar-Siddhiq/django_messenger/assets/148426945/87d9d67d-aae0-4152-adc8-72d4546e5c4f)

#### For Full Demo: [https://www.youtube.com/watch?v=GjzBtjxXUOo](https://www.youtube.com/watch?v=GjzBtjxXUOo)

 
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
    This will start the development API server, and you can access the application at [http://localhost:8000/](http://localhost:8000/)

# Thank You 💖
