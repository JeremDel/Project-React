# Application technical instructions



## Development


### Prerequisites

- Nodejs v16 installed (you may use nvm or nvm for windows)
- Access to the [gitlab repository](https://github.com/JeremDel/Project-React)


### Getting started

1. Clone [this project](https://github.com/JeremDel/Project-React)
   in your local machine
2. Create a firebase project
   [Firebase Console](https://console.firebase.google.com/u/0/)
3. Install Yarn by typing 
   ```bash
   npm install --global yarn
   ```
4. Set up environment variables by using those of your firebase project
   ```bash
   cp .env.local.sample .env.local
   ```
5. Install all dependencies:
   ```bash
   yarn
   ```
6. Start the project locally
   ```bash
   npm run start
   ```


## Production

To do.